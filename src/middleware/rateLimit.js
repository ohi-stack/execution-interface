const buckets = new Map();

const WINDOW_MS = 60_000;
const MAX_REQ_PER_WINDOW = 60;

export const verifyRateLimit = (req, res, next) => {
  const key = req.ip || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const existing = buckets.get(key) || { count: 0, resetAt: now + WINDOW_MS };

  if (now > existing.resetAt) {
    existing.count = 0;
    existing.resetAt = now + WINDOW_MS;
  }

  existing.count += 1;
  buckets.set(key, existing);

  if (existing.count > MAX_REQ_PER_WINDOW) {
    return res.status(429).json({
      error: 'Too many requests',
      code: 'RATE_LIMITED',
      details: ['Verification request rate exceeded. Retry later.'],
      timestamp_utc: new Date().toISOString(),
    });
  }

  return next();
};

