import crypto from 'node:crypto';
import { buildErrorResponse } from '../utils/apiError.js';

const configuredKeys = (process.env.QRV_API_KEYS || '')
  .split(',')
  .map((entry) => entry.trim())
  .filter(Boolean);

const timingSafeIncludes = (providedKey) => configuredKeys.some((knownKey) => {
  const left = Buffer.from(knownKey);
  const right = Buffer.from(providedKey);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
});

export const requireApiKey = (req, res, next) => {
  if (configuredKeys.length === 0) {
    return next();
  }

  const key = req.header('x-api-key') || req.query.api_key;
  if (!key || typeof key !== 'string' || !timingSafeIncludes(key)) {
    return res.status(401).json(buildErrorResponse({
      error: 'Missing or invalid API key',
      code: 'API_KEY_INVALID',
      details: ['Provide x-api-key header with a valid key'],
    }));
  }

  return next();
};
