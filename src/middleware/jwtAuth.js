import crypto from 'node:crypto';
import { env } from '../config/env.js';

const bearerToken = (headerValue = '') => {
  if (!headerValue.startsWith('Bearer ')) return null;
  return headerValue.slice('Bearer '.length).trim();
};

const decodeBase64UrlJson = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
  return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
};

const verifyToken = (token) => {
  const [headerPart, payloadPart, signaturePart] = token.split('.');
  if (!headerPart || !payloadPart || !signaturePart) throw new Error('Malformed token');

  const signedContent = `${headerPart}.${payloadPart}`;
  const expected = crypto
    .createHmac('sha256', env.JWT_SECRET)
    .update(signedContent)
    .digest('base64url');

  if (expected !== signaturePart) throw new Error('Invalid token signature');

  const payload = decodeBase64UrlJson(payloadPart);
  if (payload?.exp && (Date.now() / 1000) > payload.exp) throw new Error('Token expired');
  return payload;
};

export const requireJwtAuth = (allowedRoles = []) => (req, res, next) => {
  const token = bearerToken(req.header('authorization') || '') || req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({
      error: 'Authentication required',
      code: 'AUTH_REQUIRED',
      details: ['Provide Bearer token or x-auth-token'],
      timestamp_utc: new Date().toISOString(),
    });
  }

  try {
    const claims = verifyToken(token);
    req.auth = claims;
    if (allowedRoles.length > 0 && !allowedRoles.includes(claims.role)) {
      return res.status(403).json({
        error: 'Insufficient role',
        code: 'RBAC_DENY',
        details: [`Required roles: ${allowedRoles.join(', ')}`],
        timestamp_utc: new Date().toISOString(),
      });
    }
    return next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid token',
      code: 'AUTH_INVALID',
      details: [error.message],
      timestamp_utc: new Date().toISOString(),
    });
  }
};
