const buckets = new Map();

export const rateLimit = ({ windowMs = 60_000, max = 60 } = {}) => (req, res, next) => {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  const routeKey = `${ip}:${req.baseUrl}${req.path}`;
  const now = Date.now();
  const existing = buckets.get(routeKey) || { count: 0, resetAt: now + windowMs };

  if (now > existing.resetAt) {
    existing.count = 0;
    existing.resetAt = now + windowMs;
  }

  existing.count += 1;
  buckets.set(routeKey, existing);

  if (existing.count > max) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      code: 'RATE_LIMITED',
      details: [`retry after ${Math.ceil((existing.resetAt - now) / 1000)} second(s)`],
      timestamp_utc: new Date().toISOString(),
    });
  }

import { buildErrorResponse } from '../utils/apiError.js';

const bucket = new Map();

const getClientId = (req) => req.ip || req.header('x-forwarded-for') || 'unknown';

export const simpleRateLimit = ({ windowMs, maxRequests, keyPrefix }) => (req, res, next) => {
  const now = Date.now();
  const clientId = `${keyPrefix}:${getClientId(req)}`;
  const current = bucket.get(clientId);

  if (!current || current.resetAt <= now) {
    bucket.set(clientId, { count: 1, resetAt: now + windowMs });
    return next();
  }

  if (current.count >= maxRequests) {
    const retrySeconds = Math.ceil((current.resetAt - now) / 1000);
    res.setHeader('retry-after', String(retrySeconds));

    return res.status(429).json(buildErrorResponse({
      error: 'Rate limit exceeded',
      code: 'RATE_LIMIT_EXCEEDED',
      details: [`Try again in ${retrySeconds} second(s)`],
    }));
  }

  current.count += 1;
  return next();
};
