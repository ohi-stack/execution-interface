const QRVID_PATTERN = /^QRV-[A-Z0-9-]{6,64}$/i;

export const sanitizeQRVID = (value) => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().replace(/[^A-Za-z0-9-]/g, '').toUpperCase();
};

export const isValidQRVID = (value) => QRVID_PATTERN.test(value);

export const truncateHash = (value) => {
  if (typeof value !== 'string' || value.length === 0) {
    return null;
  }

  return value.length <= 18 ? value : `${value.slice(0, 15)}...`;
};
