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

  return next();
};
