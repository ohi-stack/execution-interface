const requests = new Map();

function secondsUntil(resetAt, now) {
  return Math.max(1, Math.ceil((resetAt - now) / 1000));
}

function rateLimit({ limit, windowMs }) {
  return (req, res, next) => {
    const key = req.apiKeyMeta?.name || req.ip;
    const now = Date.now();
    const item = requests.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > item.resetAt) {
      item.count = 0;
      item.resetAt = now + windowMs;
    }

    item.count += 1;
    requests.set(key, item);

    const remaining = Math.max(0, limit - item.count);
    res.setHeader('RateLimit-Limit', String(limit));
    res.setHeader('RateLimit-Remaining', String(remaining));
    res.setHeader('RateLimit-Reset', String(secondsUntil(item.resetAt, now)));

    if (item.count > limit) {
      res.setHeader('Retry-After', String(secondsUntil(item.resetAt, now)));
      return res.status(429).json({
        error: 'rate_limited',
        message: 'Rate limit exceeded',
        limit,
        windowMs,
        requestId: req.requestId
      });
    }

    next();
  };
}

module.exports = { rateLimit, requests };
