const parseIssuerKeys = () => {
  const raw = process.env.QRV_ISSUER_KEYS || '';
  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((map, entry) => {
      const [issuer, key] = entry.split(':').map((value) => value?.trim());
      if (issuer && key) {
        map.set(issuer, key);
      }
      return map;
    }, new Map());
};

const unauthorized = (res, code, message) => res.status(401).json({
  error: message,
  code,
  details: ['Valid issuer API key required via x-issuer-key header'],
  timestamp_utc: new Date().toISOString(),
});

export const requireIssuerApiKey = (req, res, next) => {
  const issuer = req.body?.issuer || req.header('x-issuer-id');
  const provided = req.header('x-issuer-key');
  const issuerKeys = parseIssuerKeys();

  if (issuerKeys.size === 0 && process.env.NODE_ENV !== 'production') {
    return next();
  }

  if (!issuer) {
    return unauthorized(res, 'ISSUER_REQUIRED', 'Issuer identifier is required');
  }

  const expected = issuerKeys.get(issuer);
  if (!expected) {
    return unauthorized(res, 'ISSUER_UNKNOWN', 'Issuer is not registered');
  }

  if (!provided || provided !== expected) {
    return unauthorized(res, 'ISSUER_AUTH_FAILED', 'Issuer API key is invalid');
  }

  return next();
};
