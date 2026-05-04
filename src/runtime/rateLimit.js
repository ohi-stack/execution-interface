const requests = new Map();

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

    if (item.count > limit) {
      return res.status(429).json({
        error: 'rate_limited',
        message: 'Rate limit exceeded',
        limit,
        windowMs
      });
    }

    next();
  };
}

module.exports = { rateLimit };
