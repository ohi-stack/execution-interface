const QRVID_PATTERN = /^QRV-(PROD|TEST|DEMO)-[A-Z0-9]{2,12}-[0-9]{6}$/i;

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

export const formatDisplayTimestamp = (value) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toISOString().slice(0, 10);
};
