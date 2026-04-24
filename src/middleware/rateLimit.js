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
