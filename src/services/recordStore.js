import crypto from 'node:crypto';
import { validators } from './schemaRegistry.js';
import { getIssuerById, verifyRecordSignature } from './issuerRegistry.js';

const records = new Map();
const auditLog = [];

const nowUtc = () => new Date().toISOString();

const normalizeRecord = (record) => ({
  id: record.id,
  qrvid: record.qrvid,
  certificate_title: record.certificate_title,
  record_type: record.record_type,
  recipient: record.recipient,
  issuer_id: record.issuer_id || record.issuer,
  issuer: record.issuer,
  subject: record.subject,
  issued_at_utc: record.issued_at_utc,
  expires_at_utc: record.expires_at_utc || null,
  revoked_at_utc: record.revoked_at_utc || null,
  status: getStatus(record),
  signature: record.signature || null,
  metadata_hash: record.metadata_hash,
  hash: record.metadata_hash,
  created_at_utc: record.created_at_utc,
  updated_at_utc: record.updated_at_utc,
});

const getStatus = (record) => {
  if (!record) {
    return 'NOT_FOUND';
  }

  if (record.revoked_at_utc) {
    return 'REVOKED';
  }

  if (record.expires_at_utc && new Date(record.expires_at_utc).getTime() < Date.now()) {
    return 'EXPIRED';
  }

  if (!verifyRecordSignature({
    issuerId: record.issuer_id || record.issuer,
    hash: record.metadata_hash,
    signature: record.signature,
  })) {
    return 'INVALID_SIGNATURE';
  }

  return 'VERIFIED';
};

export const createRecord = (payload) => {
  if (!validators.createRecord(payload).isValid) {
    return {
      ok: false,
      statusCode: 400,
      error: {
        error: 'Invalid request',
        code: 'INVALID_REQUEST',
        details: validators.createRecord(payload).errors,
        timestamp_utc: nowUtc(),
      },
    };
  }

  const issuer = getIssuerById(payload.issuer_id || payload.issuer);
  if (!issuer) {
    return {
      ok: false,
      statusCode: 403,
      error: {
        error: 'Unknown issuer',
        code: 'UNKNOWN_ISSUER',
        details: [`issuer ${payload.issuer_id || payload.issuer} is not registered`],
        timestamp_utc: nowUtc(),
      },
    };
  }

  if (records.has(payload.qrvid)) {
    return {
      ok: false,
      statusCode: 409,
      error: {
        error: 'Record already exists',
        code: 'QRVID_CONFLICT',
        details: [`qrvid ${payload.qrvid} already exists`],
        timestamp_utc: nowUtc(),
      },
    };
  }

  const record = {
    id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    ...payload,
    issuer: payload.issuer || issuer.issuer_name,
    issuer_id: payload.issuer_id || issuer.issuer_id,
    status: 'ACTIVE',
    revoked_at_utc: null,
    created_at_utc: nowUtc(),
    updated_at_utc: nowUtc(),
  };

  records.set(record.qrvid, record);
  auditLog.push({ action: 'create', qrvid: record.qrvid, timestamp_utc: nowUtc() });
  return { ok: true, record: normalizeRecord(record) };
};

export const revokeRecord = (qrvid, revokePayload) => {
  const record = records.get(qrvid);

  if (!record) {
    return {
      ok: false,
      statusCode: 404,
      error: {
        error: 'Record not found',
        code: 'NOT_FOUND',
        details: [`qrvid ${qrvid} does not exist`],
        timestamp_utc: nowUtc(),
      },
    };
  }

  record.revoked_at_utc = revokePayload.revoked_at_utc;
  record.revocation_reason = revokePayload.reason;
  record.status = 'REVOKED';
  record.updated_at_utc = nowUtc();
  auditLog.push({ action: 'revoke', qrvid, timestamp_utc: nowUtc(), reason: revokePayload.reason });

  return { ok: true, record: normalizeRecord(record) };
};

export const verifyRecord = (qrvid) => {
  const record = records.get(qrvid);
  const status = getStatus(record);

  const response = {
    qrvid,
    status,
    issuer: record?.issuer || null,
    issuer_id: record?.issuer_id || record?.issuer || null,
    certificate_title: record?.certificate_title || null,
    record_type: record?.record_type || null,
    recipient: record?.recipient || record?.subject || null,
    subject: record?.subject || null,
    issued_at_utc: record?.issued_at_utc || null,
    expires_at_utc: record?.expires_at_utc || null,
    revoked_at_utc: record?.revoked_at_utc || null,
    metadata_hash: record?.metadata_hash || null,
    hash: record?.metadata_hash || null,
    signature: record?.signature || null,
    checked_at_utc: nowUtc(),
    message: {
      VERIFIED: 'Record is valid and active',
      REVOKED: 'Record has been revoked',
      EXPIRED: 'Record has expired',
      NOT_FOUND: 'Record not found',
      INVALID_SIGNATURE: 'Record signature validation failed',
    }[status],
  };

  const validation = validators.verifyResponse(response);
  if (!validation.isValid) {
    return {
      ok: false,
      statusCode: 500,
      error: {
        error: 'Verification response invalid',
        code: 'VERIFY_RESPONSE_INVALID',
        details: validation.errors,
        timestamp_utc: nowUtc(),
      },
    };
  }

  return {
    ok: true,
    statusCode: status === 'NOT_FOUND' ? 404 : 200,
    verification: response,
  };
};

export const listRecords = () => [...records.values()].map(normalizeRecord);

export const getRecord = (qrvid) => {
  const record = records.get(qrvid);
  if (!record) return null;
  return normalizeRecord(record);
};

export const seedDemoRecord = () => {
  const qrvid = 'QRV-DEMO-CERT-000001';
  if (records.has(qrvid)) {
    return normalizeRecord(records.get(qrvid));
  }

  const payload = {
    qrvid,
    issuer: 'ONEGODIAN, LLC',
    issuer_id: 'issuer-onegodian-001',
    subject: 'Arielle Knight',
    recipient: 'Arielle Knight',
    certificate_title: 'QR-V Protocol Activation Certificate',
    record_type: 'CERTIFICATE',
    issued_at_utc: '2026-04-06T00:00:00Z',
    expires_at_utc: '2028-04-06T00:00:00Z',
    metadata_hash: 'ef7f5f9367fda76f5c6a12b9ad7ea81748660295f3ec6c28f6d57770a4ca5f3f',
    signature: 'demo',
  };

  payload.signature = crypto
    .createHash('sha256')
    .update(`${payload.metadata_hash}:${payload.issuer_id}:demo-secret`)
    .digest('hex');

  createRecord(payload);
  return normalizeRecord(records.get(payload.qrvid));
};

export const resetRecordStore = () => {
  records.clear();
  auditLog.length = 0;
};
