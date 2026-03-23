import { generateQrvidRecord, getProtocolTypeSegment } from '../utils/idGenerator.js';
import { normalizeQRVID, validateQRVID } from '../utils/qrvid.js';
import { buildIntegrityEnvelope, canonicalizeRecord, hashPayload, signHash, verifyIntegrityEnvelope } from '../utils/crypto.js';
import { query } from './databaseService.js';

const CREATE_TABLE_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS issuer_records (
    id BIGSERIAL PRIMARY KEY,
    qrvid TEXT NOT NULL UNIQUE,
    qrvid_compact TEXT,
    qrvid_protocol TEXT,
    registry_namespace TEXT,
    object_id TEXT,
    issuer_id TEXT NOT NULL,
    issuer_name TEXT NOT NULL,
    record_type TEXT NOT NULL,
    asset_name TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    payload_hash TEXT NOT NULL,
    signature TEXT NOT NULL,
    canonical_payload JSONB NOT NULL,
    verify_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    revoked_reason TEXT,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `ALTER TABLE issuer_records ADD COLUMN IF NOT EXISTS qrvid_compact TEXT`,
  `ALTER TABLE issuer_records ADD COLUMN IF NOT EXISTS qrvid_protocol TEXT`,
  `ALTER TABLE issuer_records ADD COLUMN IF NOT EXISTS registry_namespace TEXT`,
  `ALTER TABLE issuer_records ADD COLUMN IF NOT EXISTS object_id TEXT`,
  `UPDATE issuer_records
     SET qrvid_compact = COALESCE(qrvid_compact, qrvid),
         object_id = COALESCE(object_id, regexp_replace(COALESCE(qrvid_compact, qrvid), '^QRV-[A-Z]+-', '')),
         registry_namespace = COALESCE(registry_namespace, NULLIF(lower(regexp_replace(issuer_id, '[^a-zA-Z0-9]+', '-', 'g')), ''), 'qrv'),
         qrvid_protocol = COALESCE(
           qrvid_protocol,
           'QRV://' || COALESCE(NULLIF(lower(regexp_replace(issuer_id, '[^a-zA-Z0-9]+', '-', 'g')), ''), 'qrv') || '/' ||
           CASE lower(record_type)
             WHEN 'identity' THEN 'identity'
             WHEN 'member' THEN 'member'
             WHEN 'membership' THEN 'member'
             WHEN 'document' THEN 'document'
             WHEN 'product' THEN 'product'
             WHEN 'asset' THEN 'asset'
             WHEN 'financial' THEN 'financial'
             WHEN 'property' THEN 'property'
             WHEN 'ticket' THEN 'ticket'
             ELSE 'certificate'
           END || '/' || COALESCE(object_id, regexp_replace(COALESCE(qrvid_compact, qrvid), '^QRV-[A-Z]+-', ''))
         )
   WHERE qrvid_compact IS NULL OR qrvid_protocol IS NULL OR registry_namespace IS NULL OR object_id IS NULL`,
  `CREATE UNIQUE INDEX IF NOT EXISTS issuer_records_qrvid_compact_idx ON issuer_records(qrvid_compact)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS issuer_records_qrvid_protocol_idx ON issuer_records(qrvid_protocol)`,
  `CREATE INDEX IF NOT EXISTS issuer_records_registry_namespace_idx ON issuer_records(registry_namespace)`,
  `CREATE INDEX IF NOT EXISTS issuer_records_object_id_idx ON issuer_records(object_id)`,
  `CREATE TABLE IF NOT EXISTS issuer_audit_log (
    id BIGSERIAL PRIMARY KEY,
    qrvid TEXT,
    event_type TEXT NOT NULL,
    actor_id TEXT,
    event_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE INDEX IF NOT EXISTS issuer_records_status_idx ON issuer_records(status)`,
  `CREATE INDEX IF NOT EXISTS issuer_records_created_at_idx ON issuer_records(created_at DESC)`
];

let schemaInitialized = false;

const buildVerifyUrl = (compactQrvid) => {
  const baseUrl = process.env.PUBLIC_VERIFY_BASE_URL || process.env.APP_BASE_URL || 'http://localhost:3000';
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  if (normalizedBaseUrl.endsWith('/verify') || normalizedBaseUrl.includes('verify.qrv.network')) {
    return `${normalizedBaseUrl}/${compactQrvid}`;
  }

  return `${normalizedBaseUrl}/verify/${compactQrvid}`;
};

const mapRecord = (row) => {
  if (!row) {
    return null;
  }

  const canonicalPayload = typeof row.canonical_payload === 'string'
    ? row.canonical_payload
    : JSON.stringify(row.canonical_payload);

  return {
    qrvid: row.qrvid,
    qrvidCompact: row.qrvid_compact || row.qrvid,
    qrvidProtocol: row.qrvid_protocol,
    registryNamespace: row.registry_namespace,
    objectId: row.object_id,
    issuerId: row.issuer_id,
    issuerName: row.issuer_name,
    recordType: row.record_type,
    assetName: row.asset_name,
    recipientName: row.recipient_name,
    description: row.description,
    metadata: row.metadata || {},
    payloadHash: row.payload_hash,
    signature: row.signature,
    canonicalPayload,
    verifyUrl: row.verify_url,
    status: row.status,
    revokedReason: row.revoked_reason,
    revokedAt: row.revoked_at instanceof Date ? row.revoked_at.toISOString() : row.revoked_at,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : row.updated_at,
    integrityValid: verifyIntegrityEnvelope({
      canonicalPayload,
      payloadHash: row.payload_hash,
      signature: row.signature,
    }),
  };
};

const appendAuditLog = async ({ qrvid, eventType, actorId = null, payload = {} }) => {
  await query(
    `INSERT INTO issuer_audit_log (qrvid, event_type, actor_id, event_payload)
     VALUES ($1, $2, $3, $4::jsonb)`,
    [qrvid, eventType, actorId, JSON.stringify(payload)],
  );
};

const resolveNormalizedQrvid = (input) => {
  if (!input) {
    return null;
  }

  if (typeof input === 'object' && input.compact) {
    return input;
  }

  return normalizeQRVID(input);
};

export const initializeRegistrySchema = async () => {
  if (schemaInitialized) {
    return;
  }

  for (const statement of CREATE_TABLE_STATEMENTS) {
    await query(statement);
  }

  schemaInitialized = true;
};

export const createRecord = async ({ issuer, recordType, assetName, recipientName, description, metadata = {} }) => {
  await initializeRegistrySchema();

  const qrvidRecord = generateQrvidRecord({ issuer, recordType });
  const normalizedQrvid = normalizeQRVID(qrvidRecord.protocolQrvid) || normalizeQRVID(qrvidRecord.compactQrvid);
  const verifyUrl = buildVerifyUrl(qrvidRecord.compactQrvid);
  const now = new Date().toISOString();

  const issuerId = issuer.issuerId || issuer.id;
  const issuerName = issuer.issuerName || issuer.name;

  const unsignedRecord = {
    qrvid: normalizedQrvid?.compact || qrvidRecord.compactQrvid,
    qrvidCompact: normalizedQrvid?.compact || qrvidRecord.compactQrvid,
    qrvidProtocol: normalizedQrvid?.protocol || qrvidRecord.protocolQrvid,
    registryNamespace: normalizedQrvid?.namespace || qrvidRecord.registryNamespace,
    objectId: normalizedQrvid?.objectId || qrvidRecord.objectId,
    issuerId,
    issuerName,
    recordType,
    assetName,
    recipientName,
    description,
    metadata,
    createdAt: now,
    status: 'active',
  };

  const { canonicalPayload, payloadHash, signature } = buildIntegrityEnvelope(unsignedRecord);
  const result = await query(
    `INSERT INTO issuer_records (
      qrvid, qrvid_compact, qrvid_protocol, registry_namespace, object_id,
      issuer_id, issuer_name, record_type, asset_name, recipient_name, description,
      metadata, payload_hash, signature, canonical_payload, verify_url
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13, $14, $15::jsonb, $16)
    RETURNING *`,
    [
      unsignedRecord.qrvid,
      unsignedRecord.qrvidCompact,
      unsignedRecord.qrvidProtocol,
      unsignedRecord.registryNamespace,
      unsignedRecord.objectId,
      issuerId,
      issuerName,
      recordType,
      assetName,
      recipientName,
      description,
      JSON.stringify(metadata),
      payloadHash,
      signature,
      canonicalPayload,
      verifyUrl,
    ],
  );

  await appendAuditLog({
    qrvid: unsignedRecord.qrvid,
    eventType: 'record_created',
    actorId: issuerId,
    payload: {
      assetName,
      recipientName,
      recordType,
      qrvidProtocol: unsignedRecord.qrvidProtocol,
      registryNamespace: unsignedRecord.registryNamespace,
      objectId: unsignedRecord.objectId,
    },
  });

  return mapRecord(result.rows[0]);
};

export const createRecordInRegistry = createRecord;

export const listRecords = async () => {
  await initializeRegistrySchema();
  const result = await query('SELECT * FROM issuer_records ORDER BY created_at DESC LIMIT 100');
  return result.rows.map(mapRecord);
};

export const getAllRecords = listRecords;

export const getRecordByQrvid = async (qrvid) => {
  await initializeRegistrySchema();
  const normalizedQrvid = resolveNormalizedQrvid(qrvid);
  if (!normalizedQrvid) {
    return null;
  }

  const result = await query(
    `SELECT * FROM issuer_records
     WHERE qrvid = $1 OR qrvid_compact = $1 OR qrvid_protocol = $2
     LIMIT 1`,
    [normalizedQrvid.compact, normalizedQrvid.protocol],
  );
  return mapRecord(result.rows[0]);
};

export const getRecordByQRVID = getRecordByQrvid;

export const verifyRecord = async (qrvid) => {
  const normalizedQrvid = resolveNormalizedQrvid(qrvid);
  if (!normalizedQrvid) {
    return null;
  }

  const record = await getRecordByQrvid(normalizedQrvid);
  if (!record) {
    return null;
  }

  await appendAuditLog({
    qrvid: record.qrvid,
    eventType: 'record_verified',
    payload: {
      status: record.status,
      integrityValid: record.integrityValid,
      qrvidProtocol: record.qrvidProtocol,
    },
  });

  return {
    status: record.status === 'revoked' ? 'REVOKED' : record.integrityValid ? 'VERIFIED' : 'INVALID',
    record,
  };
};

export const revokeRecord = async ({ qrvid, reason, issuer }) => {
  await initializeRegistrySchema();
  const normalizedQrvid = resolveNormalizedQrvid(qrvid);
  if (!normalizedQrvid) {
    return null;
  }

  const issuerId = issuer.issuerId || issuer.id;
  const result = await query(
    `UPDATE issuer_records
     SET status = 'revoked', revoked_reason = $2, revoked_at = NOW(), updated_at = NOW()
     WHERE qrvid = $1 OR qrvid_compact = $1 OR qrvid_protocol = $3
     RETURNING *`,
    [normalizedQrvid.compact, reason, normalizedQrvid.protocol],
  );

  const record = mapRecord(result.rows[0]);
  if (!record) {
    return null;
  }

  const rebuiltPayload = canonicalizeRecord({
    qrvid: record.qrvid,
    qrvidCompact: record.qrvidCompact,
    qrvidProtocol: record.qrvidProtocol,
    registryNamespace: record.registryNamespace,
    objectId: record.objectId,
    issuerId: record.issuerId,
    issuerName: record.issuerName,
    recordType: record.recordType,
    assetName: record.assetName,
    recipientName: record.recipientName,
    description: record.description,
    metadata: record.metadata,
    createdAt: record.createdAt,
    status: record.status,
  });

  const rebuiltHash = hashPayload(rebuiltPayload);
  const rebuiltSignature = signHash(rebuiltHash);

  await query(
    `UPDATE issuer_records
     SET canonical_payload = $2::jsonb, payload_hash = $3, signature = $4, updated_at = NOW()
     WHERE qrvid = $1 OR qrvid_compact = $1 OR qrvid_protocol = $5`,
    [normalizedQrvid.compact, rebuiltPayload, rebuiltHash, rebuiltSignature, normalizedQrvid.protocol],
  );

  await appendAuditLog({
    qrvid: record.qrvid,
    eventType: 'record_revoked',
    actorId: issuerId,
    payload: { reason, qrvidProtocol: record.qrvidProtocol },
  });

  return getRecordByQrvid(normalizedQrvid);
};

export const revokeRecordByQRVID = revokeRecord;
export const isValidRegistryQrvid = (qrvid) => validateQRVID(qrvid);
export const getProtocolPathForRecordType = getProtocolTypeSegment;
