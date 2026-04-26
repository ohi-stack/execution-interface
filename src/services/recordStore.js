import crypto from 'node:crypto';
import { Pool } from 'pg';
import { validators } from './schemaRegistry.js';

const isProduction = (process.env.NODE_ENV || '').toLowerCase() === 'production';
const nowUtc = () => new Date().toISOString();
const signatureSecret = process.env.QRV_SIGNING_SECRET || 'dev-signing-secret';

if (isProduction && !process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required in production. In-memory fallback is disabled.');
}

const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL }) : null;

const memory = { records: new Map(), issuers: new Map(), apiKeys: new Map() };
const qrvidPattern = /^QRV-[A-Z0-9-]{6,64}$/i;

const canonicalString = (record) => [record.qrvid, record.issuer, record.subject, record.issued_at_utc, record.expires_at_utc || '', record.metadata_hash].join('|');
const generateMetadataHash = (payload) => crypto.createHash('sha256').update(JSON.stringify({ issuer: payload.issuer, subject: payload.subject, issued_at_utc: payload.issued_at_utc, expires_at_utc: payload.expires_at_utc || null })).digest('hex');
const signRecord = (record) => crypto.createHmac('sha256', signatureSecret).update(canonicalString(record)).digest('hex');

const normalizeRecord = (record) => ({
  qrvid: record.qrvid,
  issuer: record.issuer,
  subject: record.subject,
  certificate_title: record.certificate_title || null,
  issuer_logo_url: record.issuer_logo_url || null,
  proof_reference: record.proof_reference || null,
  issued_at_utc: record.issued_at_utc,
  expires_at_utc: record.expires_at_utc || null,
  revoked_at_utc: record.revoked_at_utc || null,
  metadata_hash: record.metadata_hash,
  signature: record.signature,
});

const getStatus = (record) => {
  if (!record) return 'NOT_FOUND';
  if (record.revoked_at) return 'REVOKED';
  if (record.expires_at && new Date(record.expires_at).getTime() < Date.now()) return 'EXPIRED';
  return 'VERIFIED';
};

const withError = (statusCode, error, code, details) => ({ ok: false, statusCode, error: { error, code, details, timestamp_utc: nowUtc() } });

const mapDbRecord = (row) => ({
  qrvid: row.qrvid,
  issuer: row.issuer,
  subject: row.subject,
  certificate_title: row.certificate_title,
  issuer_logo_url: row.issuer_logo_url,
  proof_reference: row.proof_reference,
  issued_at_utc: new Date(row.issued_at_utc).toISOString(),
  expires_at_utc: row.expires_at_utc ? new Date(row.expires_at_utc).toISOString() : null,
  revoked_at_utc: row.revoked_at_utc ? new Date(row.revoked_at_utc).toISOString() : null,
  metadata_hash: row.metadata_hash,
  signature: row.signature,
});

const mapCanonicalRecord = (row) => ({
  qrvid: row.qrvid,
  title: row.title || null,
  subject: row.subject || null,
  issuer: row.issuer || null,
  issued_at: row.issued_at ? new Date(row.issued_at).toISOString() : null,
  expires_at: row.expires_at ? new Date(row.expires_at).toISOString() : null,
  revoked_at: row.revoked_at ? new Date(row.revoked_at).toISOString() : null,
  hash: row.hash || null,
  signature: row.signature || null,
  source_status: row.source_status || null,
});

const isMissingOptionalJoinTable = (error) =>
  error?.code === '42P01' && (error.message.includes('qr_certificates') || error.message.includes('qr_issuers'));

const readRecordById = async (qrvid) => {
  if (!pool) return null;

  const fullQuery = `
    SELECT
      o.qrvid,
      o.subject,
      o.status AS source_status,
      o.issued_at,
      o.expires_at,
      o.revoked_at,
      COALESCE(c.title, o.title) AS title,
      COALESCE(i.issuer_name, o.issuer, o.issuer_id) AS issuer,
      h.hash,
      h.signature
    FROM qr_objects o
    LEFT JOIN qr_hash_registry h ON h.qrvid = o.qrvid
    LEFT JOIN qr_certificates c ON c.qrvid = o.qrvid
    LEFT JOIN qr_issuers i ON i.issuer_id = COALESCE(c.issuer_id, o.issuer_id)
    WHERE o.qrvid = $1
    LIMIT 1
  `;

  const fallbackQuery = `
    SELECT
      o.qrvid,
      o.subject,
      o.status AS source_status,
      o.issued_at,
      o.expires_at,
      o.revoked_at,
      o.title AS title,
      COALESCE(o.issuer, o.issuer_id) AS issuer,
      h.hash,
      h.signature
    FROM qr_objects o
    LEFT JOIN qr_hash_registry h ON h.qrvid = o.qrvid
    WHERE o.qrvid = $1
    LIMIT 1
  `;

  try {
    const result = await pool.query(fullQuery, [qrvid]);
    return result.rows[0] ? mapCanonicalRecord(result.rows[0]) : null;
  } catch (error) {
    if (!isMissingOptionalJoinTable(error)) throw error;
    const result = await pool.query(fallbackQuery, [qrvid]);
    return result.rows[0] ? mapCanonicalRecord(result.rows[0]) : null;
  }
};

const upsertSeedRecord = async () => {
  const seed = {
    qrvid: 'QRV-PROD-CERT-000001',
    issuer: 'issuer-qrv-prod-001',
    subject: 'pilot-subject-000001',
    certificate_title: 'QRV Pilot Certificate',
    issuer_logo_url: 'https://issuer.qrv.network/logo.png',
    proof_reference: 'proof:qrv:prod:000001',
    issued_at_utc: '2026-04-24T00:00:00.000Z',
    expires_at_utc: '2027-04-24T00:00:00.000Z',
    metadata_hash: 'd9cb6d02dcf5d9b307fce3f19d2ec8c0d76b4ca6f5f35f579f42fd1f91f22d3b',
  };
  seed.signature = signRecord(seed);

  if (pool) {
    await pool.query(
      `INSERT INTO qrv_records (qrvid, issuer, subject, certificate_title, issuer_logo_url, proof_reference, issued_at_utc, expires_at_utc, status, revoked_at_utc, metadata_hash, signature)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'ACTIVE',NULL,$9,$10)
       ON CONFLICT (qrvid) DO UPDATE SET issuer=EXCLUDED.issuer, subject=EXCLUDED.subject, certificate_title=EXCLUDED.certificate_title, issuer_logo_url=EXCLUDED.issuer_logo_url, proof_reference=EXCLUDED.proof_reference,
       issued_at_utc=EXCLUDED.issued_at_utc, expires_at_utc=EXCLUDED.expires_at_utc, metadata_hash=EXCLUDED.metadata_hash, signature=EXCLUDED.signature, updated_at_utc=NOW()`,
      [seed.qrvid, seed.issuer, seed.subject, seed.certificate_title, seed.issuer_logo_url, seed.proof_reference, seed.issued_at_utc, seed.expires_at_utc, seed.metadata_hash, seed.signature],
    );
    return;
  }

  if (!isProduction) memory.records.set(seed.qrvid, { ...seed, status: 'ACTIVE', revoked_at_utc: null });
};

const initializeMemory = () => {
  if (isProduction) return;
  memory.issuers.set('issuer-qrv-prod-001', { issuer_id: 'issuer-qrv-prod-001', issuer_name: 'QRV Demo University', status: 'ACTIVE' });
  memory.issuers.set('issuer-qrv-prod-002', { issuer_id: 'issuer-qrv-prod-002', issuer_name: 'QRV Workforce Board', status: 'ACTIVE' });
  memory.issuers.set('issuer-qrv-prod-003', { issuer_id: 'issuer-qrv-prod-003', issuer_name: 'QRV Professional Council', status: 'ACTIVE' });
  upsertSeedRecord();
};
initializeMemory();

export const createRecord = async (payload) => {
  try {
    const record = { ...payload, metadata_hash: payload.metadata_hash || generateMetadataHash(payload), revoked_at_utc: null };
    record.signature = signRecord(record);

    if (pool) {
      const inserted = await pool.query(
        `INSERT INTO qrv_records (qrvid, issuer, subject, certificate_title, issuer_logo_url, proof_reference, issued_at_utc, expires_at_utc, status, revoked_at_utc, metadata_hash, signature)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'ACTIVE',NULL,$9,$10)
         ON CONFLICT (qrvid) DO NOTHING RETURNING *`,
        [record.qrvid, record.issuer, record.subject, record.certificate_title || null, record.issuer_logo_url || null, record.proof_reference || null, record.issued_at_utc, record.expires_at_utc || null, record.metadata_hash, record.signature],
      );
      if (inserted.rows.length === 0) return withError(409, 'Record already exists', 'QRVID_CONFLICT', [`qrvid ${record.qrvid} already exists`]);
      return { ok: true, record: normalizeRecord(mapDbRecord(inserted.rows[0])) };
    }

    if (isProduction) return withError(500, 'Repository unavailable', 'ERROR', ['Database required in production']);
    if (memory.records.has(record.qrvid)) return withError(409, 'Record already exists', 'QRVID_CONFLICT', [`qrvid ${record.qrvid} already exists`]);
    memory.records.set(record.qrvid, record);
    return { ok: true, record: normalizeRecord(record) };
  } catch (error) {
    return withError(500, 'Create record failed', 'ERROR', [error.message]);
  }
};

export const revokeRecord = async (qrvid, revokePayload) => {
  try {
    if (pool) {
      const update = await pool.query(`UPDATE qrv_records SET status='REVOKED', revoked_at_utc=$2, updated_at_utc=NOW(), revocation_reason=$3 WHERE qrvid=$1 RETURNING *`, [qrvid, revokePayload.revoked_at_utc, revokePayload.reason]);
      if (update.rows.length === 0) return withError(404, 'Record not found', 'NOT_FOUND', [`qrvid ${qrvid} does not exist`]);
      return { ok: true, record: normalizeRecord(mapDbRecord(update.rows[0])) };
    }
    if (isProduction) return withError(500, 'Repository unavailable', 'ERROR', ['Database required in production']);
    const record = memory.records.get(qrvid);
    if (!record) return withError(404, 'Record not found', 'NOT_FOUND', [`qrvid ${qrvid} does not exist`]);
    record.revoked_at_utc = revokePayload.revoked_at_utc;
    return { ok: true, record: normalizeRecord(record) };
  } catch (error) {
    return withError(500, 'Revoke record failed', 'ERROR', [error.message]);
  }
};

export const verifyRecord = async (qrvid) => {
  if (!qrvidPattern.test(qrvid || '')) {
    return {
      ok: true,
      statusCode: 400,
      verification: {
        qrvid: qrvid || null,
        status: 'INVALID_FORMAT',
        checked_at_utc: nowUtc(),
        message: 'Invalid QRVID format',
      },
    };
  }

  try {
    let record = null;
    if (pool) {
      record = await readRecordById(qrvid);
    } else if (!isProduction) {
      const memoryRecord = memory.records.get(qrvid) || null;
      record = memoryRecord
        ? {
          qrvid: memoryRecord.qrvid,
          title: memoryRecord.certificate_title || null,
          subject: memoryRecord.subject || null,
          issuer: memoryRecord.issuer || null,
          issued_at: memoryRecord.issued_at_utc || null,
          expires_at: memoryRecord.expires_at_utc || null,
          revoked_at: memoryRecord.revoked_at_utc || null,
          hash: memoryRecord.metadata_hash || null,
          signature: memoryRecord.signature || null,
          source_status: memoryRecord.status || null,
        }
        : null;
    }

    const status = getStatus(record);
    const response = {
      qrvid,
      status,
      title: record?.title || null,
      issuer: record?.issuer || null,
      subject: record?.subject || null,
      issued_at: record?.issued_at || null,
      expires_at: record?.expires_at || null,
      revoked_at: record?.revoked_at || null,
      hash: record?.hash || null,
      signature: record?.signature || null,
      // Legacy aliases to keep portal compatibility.
      certificate_title: record?.title || null,
      issued_at_utc: record?.issued_at || null,
      expires_at_utc: record?.expires_at || null,
      revoked_at_utc: record?.revoked_at || null,
      metadata_hash: record?.hash || null,
      checked_at_utc: nowUtc(),
      message: {
        VERIFIED: 'Record is valid and active',
        REVOKED: 'Record has been revoked',
        EXPIRED: 'Record has expired',
        NOT_FOUND: 'Record not found',
        INVALID_FORMAT: 'Invalid QRVID format',
        UNAVAILABLE: 'Verification repository unavailable',
      }[status] || 'Verification failed',
    };

    const validation = validators.verifyResponse(response);
    if (!validation.isValid) return withError(500, 'Verification response invalid', 'VERIFY_RESPONSE_INVALID', validation.errors);
    return { ok: true, statusCode: status === 'NOT_FOUND' ? 404 : 200, verification: response };
  } catch (_error) {
    return { ok: true, statusCode: 503, verification: { qrvid, status: 'UNAVAILABLE', checked_at_utc: nowUtc(), message: 'Verification repository unavailable' } };
  }
};

export const provisionIssuer = async ({ issuer_id, issuer_name, status = 'ACTIVE' }) => {
  if (pool) {
    const result = await pool.query(`INSERT INTO qrv_issuers (issuer_id, issuer_name, status) VALUES ($1,$2,$3)
       ON CONFLICT (issuer_id) DO UPDATE SET issuer_name=EXCLUDED.issuer_name,status=EXCLUDED.status,updated_at_utc=NOW() RETURNING *`, [issuer_id, issuer_name, status]);
    return result.rows[0];
  }
  if (isProduction) throw new Error('Database required in production');
  const issuer = { issuer_id, issuer_name, status };
  memory.issuers.set(issuer_id, issuer);
  return issuer;
};

export const provisionApiKey = async ({ key_id, issuer_id, api_key }) => {
  const hash = crypto.createHash('sha256').update(api_key).digest('hex');
  if (pool) {
    await pool.query(`INSERT INTO qrv_api_keys (key_id, issuer_id, key_hash, status) VALUES ($1,$2,$3,'ACTIVE')
       ON CONFLICT (key_id) DO UPDATE SET issuer_id=EXCLUDED.issuer_id,key_hash=EXCLUDED.key_hash,status='ACTIVE',updated_at_utc=NOW()`, [key_id, issuer_id, hash]);
  }
  if (!isProduction) memory.apiKeys.set(key_id, { key_id, issuer_id, key_hash: hash, status: 'ACTIVE' });
  return { key_id, issuer_id, status: 'ACTIVE' };
};

export const getRepositoryHealth = async () => {
  if (!pool) return { backend: isProduction ? 'unavailable' : 'memory', ready: !isProduction };
  await pool.query('SELECT 1');
  return { backend: 'postgres', ready: true };
};

export const resetRecordStore = () => {
  if (isProduction) return;
  memory.records.clear();
  memory.issuers.clear();
  memory.apiKeys.clear();
  initializeMemory();
};
