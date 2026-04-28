import { Router } from 'express';

import { env } from '../config/env';

const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    status: 'alive',
    service: 'onegodian-api',
    timestamp: new Date().toISOString()
  });
});

healthRouter.get('/ready', (_req, res) => {
  const dependencies = {
    configLoaded: true,
    databaseUrlConfigured: Boolean(env.databaseUrl),
    stripeConfigured: Boolean(env.stripeSecretKey),
    jwtConfigured: Boolean(env.jwtSecret)
  };

  const ready = Object.values(dependencies).every(Boolean);

  res.status(ready ? 200 : 503).json({
    ok: ready,
    status: ready ? 'ready' : 'degraded',
    dependencies,
    timestamp: new Date().toISOString()
  });
});

healthRouter.get('/metrics', (_req, res) => {
  const memory = process.memoryUsage();

  res.status(200).json({
    ok: true,
    version: env.appVersion,
    nodeEnv: env.nodeEnv,
    uptimeSeconds: process.uptime(),
    memory: {
      rss: memory.rss,
      heapTotal: memory.heapTotal,
      heapUsed: memory.heapUsed,
      external: memory.external
    },
    timestamp: new Date().toISOString()
  });
});

export default healthRouter;
