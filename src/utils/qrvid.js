import crypto from 'node:crypto';

export const generateQrvid = () => {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const suffix = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `QRV-${stamp}-${suffix}`;
};

export const generateUuid = () => crypto.randomUUID();
