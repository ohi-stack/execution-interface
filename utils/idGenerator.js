import crypto from 'node:crypto';

const TYPE_CODE_MAP = {
  certificate: 'CERT',
  identity: 'ID',
  member: 'ID',
  membership: 'ID',
  document: 'DOC',
  product: 'PROD',
  asset: 'ASSET',
  financial: 'FIN',
  property: 'PROP',
  ticket: 'TICKET',
};

const TYPE_SEGMENT_MAP = {
  certificate: 'certificate',
  identity: 'identity',
  member: 'member',
  membership: 'member',
  document: 'document',
  product: 'product',
  asset: 'asset',
  financial: 'financial',
  property: 'property',
  ticket: 'ticket',
};

export const QRVID_COMPACT_REGEX = /^QRV-[A-Z]+-(?:[A-Z0-9]+-)?[A-Z0-9]{6,32}$/;

const slugifyRegistryNamespace = (value = '') => {
  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || 'qrv';
};

export const getTypeCode = (recordType = 'certificate') => {
  const normalized = String(recordType).trim().toLowerCase();
  return TYPE_CODE_MAP[normalized] || 'CERT';
};

export const getProtocolTypeSegment = (recordType = 'certificate') => {
  const normalized = String(recordType).trim().toLowerCase();
  return TYPE_SEGMENT_MAP[normalized] || 'certificate';
};

export const generateObjectId = () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${datePart}${randomPart}`.slice(0, 14);
};

export const buildCompactQrvid = ({ recordType = 'certificate', objectId }) => {
  return `QRV-${getTypeCode(recordType)}-${objectId}`;
};

export const buildProtocolQrvid = ({ issuer, recordType = 'certificate', objectId }) => {
  const registryNamespace = slugifyRegistryNamespace(issuer?.slug || issuer?.issuerSlug || issuer?.issuerId || issuer?.id || issuer?.issuerName || issuer?.name || 'qrv');
  return `QRV://${registryNamespace}/${getProtocolTypeSegment(recordType)}/${objectId}`;
};

export const generateQrvidRecord = ({ issuer, recordType = 'certificate' } = {}) => {
  const objectId = generateObjectId();
  const registryNamespace = slugifyRegistryNamespace(issuer?.slug || issuer?.issuerSlug || issuer?.issuerId || issuer?.id || issuer?.issuerName || issuer?.name || 'qrv');
  const compactQrvid = buildCompactQrvid({ recordType, objectId });
  const protocolQrvid = `QRV://${registryNamespace}/${getProtocolTypeSegment(recordType)}/${objectId}`;

  return {
    qrvid: compactQrvid,
    compactQrvid,
    protocolQrvid,
    registryNamespace,
    objectId,
    typeCode: getTypeCode(recordType),
    typeSegment: getProtocolTypeSegment(recordType),
  };
};

export const normalizeQrvidLookup = (value = '') => {
  const candidate = String(value).trim();
  if (!candidate) {
    return '';
  }

  if (candidate.startsWith('http://') || candidate.startsWith('https://')) {
    try {
      const url = new URL(candidate);
      return decodeURIComponent(url.pathname.replace(/^\/+/, '')).trim();
    } catch {
      return candidate;
    }
  }

  return candidate;
};

export const isValidCompactQrvid = (qrvid) => QRVID_COMPACT_REGEX.test(String(qrvid || '').trim());

export const generateQrvid = () => generateQrvidRecord({ recordType: 'certificate' }).compactQrvid;
