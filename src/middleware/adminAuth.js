export const requireAdminApiKey = (req, res, next) => {
  const expected = process.env.ADMIN_API_KEY;
  const provided = req.header('x-admin-key');

  if (!expected) {
    return res.status(503).json({
      error: 'Admin API unavailable',
      code: 'ADMIN_API_DISABLED',
      details: ['ADMIN_API_KEY is not configured'],
      timestamp_utc: new Date().toISOString(),
    });
  }

  if (!provided || provided !== expected) {
    return res.status(401).json({
      error: 'Unauthorized',
      code: 'ADMIN_AUTH_FAILED',
      details: ['Valid x-admin-key required'],
      timestamp_utc: new Date().toISOString(),
    });
  }

  return next();
};
