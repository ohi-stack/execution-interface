import crypto from 'node:crypto';
import { env } from '../config/env.js';

const issuers = new Map([
  ['issuer-onegodian-001', {
    issuer_id: 'issuer-onegodian-001',
    issuer_name: env.ISSUER_NAME,
    api_key: process.env.ISSUER_ONEGODIAN_API_KEY || 'issuer-demo-key',
    signature_secret: env.SIGNING_SECRET,
  }],
]);

export const getIssuerById = (issuerId) => issuers.get(issuerId) || null;

export const authenticateIssuerApiKey = ({ issuerId, apiKey }) => {
  const issuer = getIssuerById(issuerId);
  if (!issuer) return false;
  return issuer.api_key === apiKey;
};

export const signRecordHash = ({ issuerId, hash }) => {
  const issuer = getIssuerById(issuerId);
  if (!issuer) return null;
  return crypto.createHash('sha256').update(`${hash}:${issuerId}:${issuer.signature_secret}`).digest('hex');
};

export const verifyRecordSignature = ({ issuerId, hash, signature }) => {
  const expected = signRecordHash({ issuerId, hash });
  if (!expected) return false;
  return expected === signature;
};
