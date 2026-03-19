import crypto from 'node:crypto';

export const generateRecordId = () => `QRV-${crypto.randomBytes(6).toString('hex')}`;
