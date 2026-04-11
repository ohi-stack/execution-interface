import { validators } from './schemaRegistry.js';
import crypto from 'node:crypto';

const records = new Map();
let sequence = 1;

const nowUtc = () => new Date().toISOString();

const normalizeRecord = (record) => ({
  qrvid: record.qrvid,
  issuer: record.issuer,
  subject: record.subject,
  issued_at_utc: record.issued_at_utc,
  expires_at_utc: record.expires_at_utc || null,
  revoked_at_utc: record.revoked_at_utc || null,
  metadata_hash: record.metadata_hash,
  record_type: record.record_type || 'certificate',
  certificate_title: record.certificate_title || null,
  description: record.description || null,
});

const nextQrvid = () => {
  const value = `QRV-CERT-${String(sequence).padStart(6, '0')}`;
  sequence += 1;
  return value;
};

const hashPayload = (payload) => crypto
  .createHash('sha256')
  .update(JSON.stringify(payload))
  .digest('hex');

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

export const createPublicRecord = (payload) => {
  const recordType = payload?.recordType || 'certificate';
  const issuer = payload?.issuer || 'QR-V';
  const recipientName = payload?.recipientName || payload?.subject || 'Production Test';
  const certificateTitle = payload?.certificateTitle || 'System Validation Certificate';
  const description = payload?.description || null;
  const qrvid = payload?.qrvid || payload?.qrv_id || nextQrvid();

  if (!/^QRV-[A-Z0-9-]{6,64}$/i.test(qrvid)) {
    return {
      ok: false,
      statusCode: 400,
      error: {
        error: 'Invalid QRVID format',
        code: 'INVALID_QRVID',
        details: ['qrvid must match QRV format'],
        timestamp_utc: nowUtc(),
      },
    };
  }

  if (records.has(qrvid)) {
    return {
      ok: false,
      statusCode: 409,
      error: {
        error: 'Record already exists',
        code: 'QRVID_CONFLICT',
        details: [`qrvid ${qrvid} already exists`],
        timestamp_utc: nowUtc(),
      },
    };
  }

  const issuedAt = nowUtc();
  const metadataHash = hashPayload({ qrvid, recordType, issuer, recipientName, certificateTitle, description, issuedAt });

  const record = {
    qrvid,
    issuer,
    subject: recipientName,
    issued_at_utc: issuedAt,
    expires_at_utc: null,
    metadata_hash: metadataHash,
    record_type: recordType,
    certificate_title: certificateTitle,
    description,
    status: 'ACTIVE',
    revoked_at_utc: null,
    created_at_utc: issuedAt,
    updated_at_utc: issuedAt,
  };

  records.set(qrvid, record);

  return {
    ok: true,
    statusCode: 201,
    record: {
      qrv_id: qrvid,
      qrvid,
      status: 'VERIFIED',
      hash: metadataHash,
      verify_url: `/verify/${encodeURIComponent(qrvid)}`,
      issued_at_utc: issuedAt,
    },
  };
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

export const verifyPublicRecord = (qrvid) => {
  const result = verifyRecord(qrvid);
  if (!result.ok) {
    return result;
  }

  const record = records.get(qrvid);
  return {
    ok: true,
    statusCode: result.statusCode,
    verification: {
      qrv_id: qrvid,
      qrvid,
      status: result.verification.status,
      type: record?.record_type || 'certificate',
      issuer: result.verification.issuer,
      recipient: result.verification.subject,
      certificateTitle: record?.certificate_title || null,
      description: record?.description || null,
      hash: result.verification.metadata_hash,
      issuedAt: result.verification.issued_at_utc,
      checkedAt: result.verification.checked_at_utc,
    },
  };
};

export const seedDefaultRecord = () => {
  if (records.has('QRV-CERT-000001')) {
    return;
  }

  createPublicRecord({
    qrvid: 'QRV-CERT-000001',
    recordType: 'certificate',
    issuer: 'QR-V',
    recipientName: 'Production Test',
    certificateTitle: 'System Validation Certificate',
    description: 'First live end-to-end validation',
  });
};

export const resetRecordStore = () => {
  records.clear();
  sequence = 1;
};
