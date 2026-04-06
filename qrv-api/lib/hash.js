import crypto from 'node:crypto';

export const canonicalize = (value) => {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = canonicalize(value[key]);
        return acc;
      }, {});
  }

  return value;
};

export const sha256 = (payload) => {
  const canonicalPayload = canonicalize(payload);
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(canonicalPayload))
    .digest('hex');
};

export const sign = (payload, secret) => {
  const canonicalPayload = canonicalize(payload);
  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(canonicalPayload))
    .digest('hex');
};
