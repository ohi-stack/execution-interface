import crypto from 'node:crypto';
import { getCookieValue } from '../utils/http.js';

const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 8;

const getIssuerConfig = () => ({
  issuerId: process.env.ISSUER_ID || 'issuer-demo',
  issuerName: process.env.ISSUER_NAME || 'QRV Demo Issuer',
  email: process.env.ISSUER_EMAIL || 'issuer@qrv.network',
  password: process.env.ISSUER_PASSWORD || 'change-me-now',
  sessionSecret: process.env.ISSUER_SESSION_SECRET || 'local-dev-session-secret',
});

const encodeToken = (payload) => Buffer.from(JSON.stringify(payload)).toString('base64url');
const decodeToken = (token) => JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));

const sign = (value, secret) => crypto.createHmac('sha256', secret).update(value).digest('hex');

export const authenticateIssuer = ({ email, password }) => {
  const config = getIssuerConfig();
  return email === config.email && password === config.password
    ? {
      id: config.issuerId,
      issuerId: config.issuerId,
      name: config.issuerName,
      issuerName: config.issuerName,
      email: config.email,
    }
    : null;
};

export const createSessionToken = (issuer) => {
  const config = getIssuerConfig();
  const payload = {
    ...issuer,
    id: issuer.id || issuer.issuerId,
    issuerId: issuer.issuerId || issuer.id,
    name: issuer.name || issuer.issuerName,
    issuerName: issuer.issuerName || issuer.name,
    issuedAt: Date.now(),
    expiresAt: Date.now() + SESSION_MAX_AGE_MS,
  };
  const encoded = encodeToken(payload);
  return `${encoded}.${sign(encoded, config.sessionSecret)}`;
};

export const verifySessionToken = (token) => {
  if (!token || !token.includes('.')) {
    return null;
  }

  const config = getIssuerConfig();
  const [encoded, signature] = token.split('.');
  if (sign(encoded, config.sessionSecret) !== signature) {
    return null;
  }

  const payload = decodeToken(encoded);
  if (payload.expiresAt < Date.now()) {
    return null;
  }

  return {
    ...payload,
    id: payload.id || payload.issuerId,
    issuerId: payload.issuerId || payload.id,
    name: payload.name || payload.issuerName,
    issuerName: payload.issuerName || payload.name,
  };
};

export const getIssuerFromRequest = (req) => {
  const cookieToken = getCookieValue(req.headers.cookie, 'issuer_session');
  return verifySessionToken(cookieToken);
};
