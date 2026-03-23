import crypto from 'node:crypto';

const getSigningSecret = () => process.env.ISSUER_SIGNING_SECRET || 'local-dev-signing-secret';

const sortKeysDeep = (value) => {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }

  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((accumulator, key) => {
        accumulator[key] = sortKeysDeep(value[key]);
        return accumulator;
      }, {});
  }

  return value;
};

const requireCanonicalField = (fieldName, value) => {
  if (value === undefined || value === null || value === '') {
    throw new Error(`Missing required canonical payload field: ${fieldName}`);
  }

  return value;
};

const assertNoUndefinedValues = (value, path = 'payload') => {
  if (value === undefined) {
    throw new Error(`Undefined value not allowed in canonical payload at ${path}`);
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoUndefinedValues(item, `${path}[${index}]`));
    return;
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, nestedValue]) => {
      assertNoUndefinedValues(nestedValue, `${path}.${key}`);
    });
  }
};

const normalizeIsoTimestamp = (fieldName, value, { required = false } = {}) => {
  if (value === undefined || value === null || value === '') {
    if (required) {
      throw new Error(`Missing required canonical payload field: ${fieldName}`);
    }
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid canonical payload timestamp: ${fieldName}`);
  }

  return date.toISOString();
};

const ensurePlainObject = (value) => {
  if (value === undefined || value === null) {
    return {};
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('metadata must be a plain object');
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new Error('metadata must be a plain object');
  }

  return value;
};

// QVR-1 canonical payload is frozen. Any shape changes require a new version (e.g. QVR-2).
export const buildQvr1CanonicalPayload = (record) => {
  const qrvidProtocol = requireCanonicalField('qrvid_protocol', record?.qrvidProtocol);
  const issuerId = requireCanonicalField('issuer_id', record?.issuerId);
  const type = requireCanonicalField('type', record?.recordType);
  const issuedAt = normalizeIsoTimestamp('issuedAt', record?.issuedAt ?? record?.createdAt, { required: true });
  const metadata = ensurePlainObject(record?.metadata);

  const payload = {
    version: 'QVR-1',
    qrvid_protocol: qrvidProtocol,
    issuer_id: issuerId,
    record: {
      type,
      asset_name: record?.assetName ?? null,
      recipient_name: record?.recipientName ?? null,
      description: record?.description ?? null,
      metadata: sortKeysDeep(metadata),
      status: record?.status ?? null,
      revoked_reason: record?.revokedReason ?? null,
    },
    timestamps: {
      created_at: issuedAt,
      updated_at: normalizeIsoTimestamp('updatedAt', record?.updatedAt),
      revoked_at: normalizeIsoTimestamp('revokedAt', record?.revokedAt),
    },
  };

  assertNoUndefinedValues(payload);
  return payload;
};

export const computeQvr1Integrity = (record) => {
  const payload = buildQvr1CanonicalPayload(record);
  const hash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');

  if (!hash || hash.length !== 64) {
    throw new Error('Invalid hash output');
  }

  return {
    payload,
    hash,
    signature: null,
    algorithm: 'sha256',
    version: 'QVR-1',
  };
};

export const canonicalizeRecord = (record) => JSON.stringify({
  qrvid: record.qrvid,
  qrvidCompact: record.qrvidCompact || record.qrvid,
  qrvidProtocol: record.qrvidProtocol || null,
  registryNamespace: record.registryNamespace || null,
  objectId: record.objectId || null,
  issuerId: record.issuerId,
  issuerName: record.issuerName,
  recordType: record.recordType,
  assetName: record.assetName,
  recipientName: record.recipientName,
  description: record.description,
  metadata: sortKeysDeep(record.metadata),
  createdAt: record.createdAt,
  status: record.status,
});

export const hashPayload = (payload) => crypto.createHash('sha256').update(payload).digest('hex');

export const signHash = (hash) => crypto.createHmac('sha256', getSigningSecret()).update(hash).digest('hex');

export const buildIntegrityEnvelope = (record) => {
  const canonicalPayload = canonicalizeRecord(record);
  const payloadHash = hashPayload(canonicalPayload);
  const signature = signHash(payloadHash);
  return { canonicalPayload, payloadHash, signature };
};

export const verifyIntegrityEnvelope = ({ canonicalPayload, payloadHash, signature }) => {
  const computedHash = hashPayload(canonicalPayload);
  const computedSignature = signHash(computedHash);
  return computedHash === payloadHash && computedSignature === signature;
};
