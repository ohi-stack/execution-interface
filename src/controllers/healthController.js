export const healthHandler = (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'onegodian-verify-portal',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
};
