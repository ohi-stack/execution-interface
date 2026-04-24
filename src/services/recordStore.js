import { validators } from './schemaRegistry.js';

const records = new Map();

const nowUtc = () => new Date().toISOString();


const normalizeRecord = (record) => ({
  qrvid: record.qrvid,
  issuer: record.issuer,
  subject: record.subject,
  issued_at_utc: record.issued_at_utc,
  expires_at_utc: record.expires_at_utc || null,
  revoked_at_utc: record.revoked_at_utc || null,
  metadata_hash: record.metadata_hash,
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

  return 'VERIFIED';
};

export const createRecord = (payload) => {
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
    ...payload,
    status: 'ACTIVE',
    revoked_at_utc: null,
    created_at_utc: nowUtc(),
    updated_at_utc: nowUtc(),
  };

  records.set(record.qrvid, record);
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

  return { ok: true, record: normalizeRecord(record) };
};

export const verifyRecord = (qrvid) => {
  const record = records.get(qrvid);
  const status = getStatus(record);

  const response = {
    qrvid,
    status,
    issuer: record?.issuer || null,
    subject: record?.subject || null,
    issued_at_utc: record?.issued_at_utc || null,
    expires_at_utc: record?.expires_at_utc || null,
    revoked_at_utc: record?.revoked_at_utc || null,
    metadata_hash: record?.metadata_hash || null,
    checked_at_utc: nowUtc(),
    message: {
      VERIFIED: 'Record is valid and active',
      REVOKED: 'Record has been revoked',
      EXPIRED: 'Record has expired',
      NOT_FOUND: 'Record not found',
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

export const resetRecordStore = () => {
  records.clear();
};
