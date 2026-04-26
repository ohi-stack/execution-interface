import { getRepositoryHealth } from '../services/recordStore.js';

const startedAt = Date.now();

const healthPayload = () => ({
  status: 'ok',
  service: process.env.SERVICE_NAME || 'execution-interface',
  version: process.env.npm_package_version || '1.1.0',
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV || 'development',
});

export const healthHandler = (_req, res) => res.status(200).json(healthPayload());

export const readyHandler = async (_req, res) => {
  try {
    const repository = await getRepositoryHealth();
    if (!repository.ready) {
      return res.status(503).json({ status: 'error', repository, service: 'execution-interface' });
    }
    return res.status(200).json({ status: 'ok', repository, service: 'execution-interface' });
  } catch (error) {
    return res.status(503).json({ status: 'error', service: 'execution-interface', reason: error.message });
  }
};

export const versionHandler = async (_req, res) => {
  const repository = await getRepositoryHealth().catch(() => ({ backend: 'unknown', ready: false }));
  res.status(200).json({ service: 'execution-interface', version: 'v1', ...healthPayload(), ready: repository.ready, checks: { process_uptime_seconds: Math.floor(process.uptime()) } });
};

export const metricsHandler = async (_req, res) => {
  const repository = await getRepositoryHealth().catch(() => ({ backend: 'unknown', ready: false }));
  const uptime = Math.floor((Date.now() - startedAt) / 1000);
  const lines = [
    '# HELP qrv_service_uptime_seconds Service uptime',
    '# TYPE qrv_service_uptime_seconds gauge',
    `qrv_service_uptime_seconds ${uptime}`,
    '# HELP qrv_repository_ready Repository readiness (1/0)',
    '# TYPE qrv_repository_ready gauge',
    `qrv_repository_ready{backend="${repository.backend}"} ${repository.ready ? 1 : 0}`,
  ];
  res.setHeader('content-type', 'text/plain; version=0.0.4');
  res.status(200).send(lines.join('\n'));
};
