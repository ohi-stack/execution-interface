import crypto from 'node:crypto';
import { buildErrorResponse } from '../utils/apiError.js';

const parseBase64Url = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${pad}`, 'base64').toString('utf8');
};

const parseJwt = (token) => {
  const [headerRaw, payloadRaw, signatureRaw] = token.split('.');
  if (!headerRaw || !payloadRaw || !signatureRaw) return null;
  const header = JSON.parse(parseBase64Url(headerRaw));
  const payload = JSON.parse(parseBase64Url(payloadRaw));
  return { headerRaw, payloadRaw, signatureRaw, header, payload };
};

const verifyHs256 = (token, secret) => {
  const parsed = parseJwt(token);
  if (!parsed || parsed.header.alg !== 'HS256') return null;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${parsed.headerRaw}.${parsed.payloadRaw}`)
    .digest('base64url');

  const left = Buffer.from(signature);
  const right = Buffer.from(parsed.signatureRaw);
  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) return null;
  if (typeof parsed.payload.exp === 'number' && parsed.payload.exp * 1000 < Date.now()) return null;
  return parsed.payload;
};

export const requireJwt = ({ roles = [] } = {}) => (req, res, next) => {
  const auth = req.header('authorization') || '';
  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json(buildErrorResponse({ error: 'Bearer token required', code: 'JWT_REQUIRED', details: ['Provide Authorization: Bearer <token>'] }));
  }

  const secret = process.env.QRV_JWT_SECRET;
  if (!secret) {
    return res.status(500).json(buildErrorResponse({ error: 'JWT secret is not configured', code: 'JWT_NOT_CONFIGURED', details: ['Set QRV_JWT_SECRET'] }));
  }

  const claims = verifyHs256(auth.slice(7), secret);
  if (!claims) {
    return res.status(401).json(buildErrorResponse({ error: 'Invalid token', code: 'JWT_INVALID', details: ['Token is missing, expired, or signature is invalid'] }));
  }

  const role = claims.role || claims.roles?.[0] || 'anonymous';
  if (roles.length > 0 && !roles.includes(role)) {
    return res.status(403).json(buildErrorResponse({ error: 'Role not authorized', code: 'JWT_ROLE_DENY', details: [`Required roles: ${roles.join(', ')}`] }));
  }

  req.jwt = claims;
  req.actorRole = role;
  return next();
};
