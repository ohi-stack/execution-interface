const COMPACT_TYPE_MAP = {
  CERT: 'certificate',
  ID: 'identity',
  DOC: 'document',
  PROD: 'product',
  ASSET: 'asset',
  FIN: 'financial',
  PROP: 'property',
  TICKET: 'ticket',
};

const PROTOCOL_TYPE_CODE_MAP = {
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

const COMPACT_QRVID_REGEX = /^QRV-([A-Z]+)-(?:([A-Z0-9]+)-)?([A-Z0-9]{6,32})$/;
const PROTOCOL_QRVID_REGEX = /^QRV:\/\/([a-z0-9-]+)\/([a-z]+)\/([A-Z0-9]{6,32})$/;

const decodeInput = (input = '') => {
  const value = String(input).trim();
  if (!value) {
    return '';
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    try {
      const url = new URL(value);
      return decodeURIComponent(url.pathname.replace(/^\/+/, '')).trim();
    } catch {
      return value;
    }
  }

  return value;
};

const buildCompact = (type, objectId) => {
  const typeCode = PROTOCOL_TYPE_CODE_MAP[type];
  return typeCode ? `QRV-${typeCode}-${objectId}` : null;
};

export const normalizeQRVID = (input) => {
  const decoded = decodeInput(input);
  if (!decoded) {
    return null;
  }

  const compactMatch = decoded.match(COMPACT_QRVID_REGEX);
  if (compactMatch) {
    const [, compactTypeCode, issuerCode, objectId] = compactMatch;
    const type = COMPACT_TYPE_MAP[compactTypeCode] || compactTypeCode.toLowerCase();
    const compact = issuerCode
      ? `QRV-${compactTypeCode}-${issuerCode}-${objectId}`
      : `QRV-${compactTypeCode}-${objectId}`;

    return {
      compact,
      protocol: null,
      objectId,
      type,
      namespace: null,
    };
  }

  const protocolMatch = decoded.match(PROTOCOL_QRVID_REGEX);
  if (protocolMatch) {
    const [, namespace, type, objectId] = protocolMatch;
    const protocol = `QRV://${namespace}/${type}/${objectId}`;

    return {
      compact: buildCompact(type, objectId),
      protocol,
      objectId,
      type,
      namespace,
    };
  }

  return null;
};

export const validateQRVID = (qrvid) => Boolean(normalizeQRVID(qrvid));
