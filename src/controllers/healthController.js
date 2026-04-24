const payload = (kind) => ({
  status: 'ok',
  check: kind,
  service: 'onegodian-verify-portal',
const healthPayload = () => ({
  status: 'ok',
  service: process.env.SERVICE_NAME || 'onegodian-verify-portal',
  version: process.env.npm_package_version || '1.0.0',
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development',
});

export const healthHandler = (_req, res) => {
  res.status(200).json(payload('health'));
};

export const readyHandler = (_req, res) => {
  res.status(200).json(payload('readiness'));
  res.status(200).json(healthPayload());
};

export const readyHandler = (_req, res) => {
  res.status(200).json({
    ...healthPayload(),
    ready: true,
    checks: {
      process_uptime_seconds: Math.floor(process.uptime()),
    },
  });
};
