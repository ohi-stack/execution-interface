export const healthHandler = (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'verify-portal',
    uptime_seconds: Math.round(process.uptime()),
    timestamp_utc: new Date().toISOString(),
  });
};

export const versionHandler = (_req, res) => {
  res.status(200).json({
    service: 'verify-portal',
    version: '1.0.0',
    node_env: process.env.NODE_ENV || 'development',
    timestamp_utc: new Date().toISOString(),
  });
};
