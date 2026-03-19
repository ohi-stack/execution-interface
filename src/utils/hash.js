import crypto from 'node:crypto';

const sortValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }

  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((accumulator, key) => {
        accumulator[key] = sortValue(value[key]);
        return accumulator;
      }, {});
  }

  return value;
};

export const toCanonicalJson = (value) => JSON.stringify(sortValue(value));

export const createSha256Hash = (value) => crypto.createHash('sha256').update(value).digest('hex');
