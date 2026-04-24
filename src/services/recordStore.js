import crypto from 'node:crypto';
import { validators } from './schemaRegistry.js';
import { isValidQRVID, sanitizeQRVID } from '../utils/qrvid.js';
import { createPostgresRecordRepository } from './postgresRecordRepository.js';
import { setMemoryMetricsSnapshot } from './metricsService.js';

const QRV_RECORD_TYPE = 'CERTIFICATE';
const HASH_TRUNCATE = 16;

const nowUtc = () => new Date().toISOString();

const resolveSigningSecret = () => {
  if (process.env.QRV_SIGNING_SECRET) {
    return process.env.QRV_SIGNING_SECRET;
  }

  if (process.env.NODE_ENV === 'production') {
    throw Object.assign(new Error('Missing QRV_SIGNING_SECRET'), { code: 'SIGNING_SECRET_MISSING' });
  }

  return 'qrv-dev-signing-secret';
};

const truncateValue = (value) => {
  if (typeof value !== 'string' || value.length <= HASH_TRUNCATE) {
    return value || null;
  }

  return `${value.slice(0, HASH_TRUNCATE)}...`;
};

const canonicalCertificatePayload = (payload) => ({
  recipient: payload.recipient,
  subject: payload.subject || payload.title,
  title: payload.title,
  description: payload.description || '',
  issuer: payload.issuer,
  issueDate: payload.issueDate,
  expirationDate: payload.expirationDate || null,
  metadata: payload.metadata || {},
});

const generateHash = (payload) => crypto
  .createHash('sha256')
  .update(JSON.stringify(canonicalCertificatePayload(payload)))
  .digest('hex');

const generateSignature = (payload) => crypto
  .createHmac('sha256', resolveSigningSecret())
  .update(`${payload.qrvid}:${payload.hash}`)
  .digest('hex');

const memoryRecords = new Map();

const createMemoryRepository = () => ({
  async createRecord(record) {
    if (memoryRecords.has(record.qrvid)) {
      return { ok: false, code: 'QRVID_CONFLICT' };
    }

    memoryRecords.set(record.qrvid, { ...record, createdAt: nowUtc(), updatedAt: nowUtc() });
    return { ok: true };
  },
  async getByQrvid(qrvid) {
    return memoryRecords.get(qrvid) || null;
  },
  async updateRecord(record) {
    memoryRecords.set(record.qrvid, { ...record, updatedAt: nowUtc() });
  },
  async revokeRecord(qrvid, { revokedAt }) {
    const record = memoryRecords.get(qrvid);
    if (!record) {
      return { ok: false, code: 'NOT_FOUND' };
    }
    record.status = 'REVOKED';
    record.revokedAt = revokedAt;
    record.updatedAt = nowUtc();
    memoryRecords.set(qrvid, record);
    return { ok: true, record };
  },
  async listIssuerRecords(issuer) {
    return [...memoryRecords.values()].filter((record) => record.issuer === issuer);
  },
  async writeAudit() {
    return;
  },
  reset() {
    memoryRecords.clear();
  },
});


const refreshMemoryMetrics = () => {
  const values = [...memoryRecords.values()];
  setMemoryMetricsSnapshot({
    scans_today: 0,
    verify_latency_ms: 0,
    total_records: values.length,
    revoked_records: values.filter((record) => record.status === 'REVOKED').length,
  });
};

let adapter = process.env.DATABASE_URL
  ? createPostgresRecordRepository({ connectionString: process.env.DATABASE_URL })
  : createMemoryRepository();

const normalizeRecordResponse = (record) => ({
  qrvid: record.qrvid,
  recordType: QRV_RECORD_TYPE,
  recipient: record.recipient,
  subject: record.subject,
  title: record.title,
  description: record.description,
  issuer: record.issuer_name || record.issuer,
  issueDate: record.issuedAt,
  expirationDate: record.expiresAt,
  metadata: record.metadata,
  status: record.status,
  hash: truncateValue(record.hash),
  signature: truncateValue(record.signature),
  verifyUrl: `https://verify.qrv.network/${record.qrvid}`,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
});

const getVerificationState = (record) => {
  if (!record) return 'NOT_FOUND';
  if (record.status === 'REVOKED' || record.revokedAt) return 'REVOKED';
  if (record.expiresAt && new Date(record.expiresAt).getTime() < Date.now()) return 'EXPIRED';
  const expectedSignature = generateSignature(record);
  if (!record.signature || record.signature !== expectedSignature) return 'INVALID_SIGNATURE';
  return 'VERIFIED';
};

const buildVerificationResponse = (qrvid, record, overrideState = null) => {
  const verificationState = overrideState || getVerificationState(record);
  return {
    qrvid,
    verificationState,
    status: verificationState,
    recordType: record?.recordType || QRV_RECORD_TYPE,
    issuer: record ? (record.issuer_name || record.issuer) : null,
    subject: record?.subject || null,
    title: record?.title || null,
    issuedAt: record?.issuedAt || null,
    expiresAt: record?.expiresAt || null,
    hash: truncateValue(record?.hash || null),
    signatureValid: verificationState === 'VERIFIED',
    canonicalUrl: `https://verify.qrv.network/${qrvid}`,
    apiUrl: `https://api.qrv.network/api/v1/verify/${qrvid}`,
    source: process.env.DATABASE_URL ? 'qrv-registry-postgres' : 'qrv-registry-memory',
    checkedAt: nowUtc(),
  };
};

export const createRecord = async (payload) => {
  const qrvid = sanitizeQRVID(payload.qrvid || `QRV-${crypto.randomBytes(6).toString('hex').toUpperCase()}`);

  if (!isValidQRVID(qrvid)) {
    return {
      ok: false,
      statusCode: 400,
      error: {
        error: 'Invalid QRVID format',
        code: 'INVALID_FORMAT',
        details: ['qrvid must match pattern QRV-[A-Z0-9-]{6,64}'],
        timestamp_utc: nowUtc(),
      },
    };
  }

  const record = {
    qrvid,
    recordType: QRV_RECORD_TYPE,
    recipient: payload.recipient || payload.subject,
    subject: payload.subject || payload.title || 'Certificate',
    title: payload.title || 'Certificate',
    description: payload.description || '',
    issuer: payload.issuer,
    issuer_name: payload.issuer,
    issuedAt: payload.issueDate || payload.issued_at_utc,
    expiresAt: payload.expirationDate || payload.expires_at_utc || null,
    metadata: payload.metadata || {},
    status: 'VERIFIED',
    revokedAt: null,
  };

  record.hash = payload.hash || payload.metadata_hash || generateHash({ ...payload, qrvid, issueDate: record.issuedAt, expirationDate: record.expiresAt });
  record.signature = payload.signature || generateSignature(record);

  const created = await adapter.createRecord(record);
  if (!created.ok) {
    return {
      ok: false,
      statusCode: created.code === 'QRVID_CONFLICT' ? 409 : 500,
      error: {
        error: created.code === 'QRVID_CONFLICT' ? 'Record already exists' : 'Record persistence failed',
        code: created.code,
        details: [created.code],
        timestamp_utc: nowUtc(),
      },
    };
  }

  const persisted = await adapter.getByQrvid(qrvid);
  if (!process.env.DATABASE_URL) refreshMemoryMetrics();
  return { ok: true, record: normalizeRecordResponse(persisted || record) };
};

export const revokeRecord = async (qrvid, revokePayload) => {
  const normalizedQrvid = sanitizeQRVID(qrvid);
  if (!isValidQRVID(normalizedQrvid)) {
    return {
      ok: false,
      statusCode: 400,
      error: { error: 'Invalid QRVID format', code: 'INVALID_FORMAT', details: ['invalid qrvid'], timestamp_utc: nowUtc() },
    };
  }

  const result = await adapter.revokeRecord(normalizedQrvid, { revokedAt: revokePayload.revoked_at_utc || nowUtc(), reason: revokePayload.reason });
  if (!result.ok) {
    return {
      ok: false,
      statusCode: 404,
      error: { error: 'Record not found', code: 'NOT_FOUND', details: [`qrvid ${normalizedQrvid} does not exist`], timestamp_utc: nowUtc() },
    };
  }

  const updated = await adapter.getByQrvid(normalizedQrvid);
  if (!process.env.DATABASE_URL) refreshMemoryMetrics();
  return { ok: true, record: normalizeRecordResponse(updated || result.record) };
};

export const verifyRecord = async (qrvid) => {
  const started = Date.now();
  const normalizedQrvid = sanitizeQRVID(qrvid);
  if (!isValidQRVID(normalizedQrvid)) {
    return { ok: true, statusCode: 400, verification: buildVerificationResponse(normalizedQrvid || qrvid, null, 'INVALID_FORMAT') };
  }

  try {
    const record = await adapter.getByQrvid(normalizedQrvid);
    const verification = buildVerificationResponse(normalizedQrvid, record);

    const validation = validators.verifyResponse(verification);
    if (!validation.isValid) {
      await adapter.writeAudit({ qrvid: normalizedQrvid, issuerId: record?.issuer || null, action: 'FAILED_VERIFY', actionStatus: 'ERROR', detail: { errors: validation.errors, latency_ms: Date.now() - started } });
      return {
        ok: true,
        statusCode: 503,
        verification: buildVerificationResponse(normalizedQrvid, null, 'UNAVAILABLE'),
      };
    }

    const failedStates = new Set(['NOT_FOUND', 'INVALID_FORMAT', 'INVALID_SIGNATURE', 'UNAVAILABLE']);
    await adapter.writeAudit({
      qrvid: normalizedQrvid,
      issuerId: record?.issuer || null,
      action: failedStates.has(verification.verificationState) ? 'FAILED_VERIFY' : 'VERIFY',
      actionStatus: failedStates.has(verification.verificationState) ? 'DENIED' : 'SUCCESS',
      detail: { verificationState: verification.verificationState, latency_ms: Date.now() - started },
    });

    const statusMap = { VERIFIED: 200, REVOKED: 200, EXPIRED: 200, NOT_FOUND: 404, INVALID_FORMAT: 400, INVALID_SIGNATURE: 200, UNAVAILABLE: 503 };
    return { ok: true, statusCode: statusMap[verification.verificationState] ?? 503, verification };
  } catch (error) {
    await adapter.writeAudit({ qrvid: normalizedQrvid, issuerId: null, action: 'FAILED_VERIFY', actionStatus: 'ERROR', detail: { error: error.message, latency_ms: Date.now() - started } }).catch(() => {});
    return { ok: true, statusCode: 503, verification: buildVerificationResponse(normalizedQrvid, null, 'UNAVAILABLE') };
  }
};

export const updateRecord = async (record) => adapter.updateRecord(record);
export const listIssuerRecords = async (issuer) => adapter.listIssuerRecords(issuer);

export const resetRecordStore = () => {
  if (typeof adapter.reset === 'function') {
    adapter.reset();
  }
};

export const __setRecordRepositoryForTests = (mockAdapter) => {
  adapter = mockAdapter;
};

export const __resetRecordRepositoryForTests = () => {
  adapter = process.env.DATABASE_URL
    ? createPostgresRecordRepository({ connectionString: process.env.DATABASE_URL })
    : createMemoryRepository();
};
