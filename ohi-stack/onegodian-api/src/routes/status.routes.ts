import { Router } from 'express';

import { env } from '../config/env';

const statusRouter = Router();

statusRouter.get('/status', (_req, res) => {
  res.status(200).json({
    ok: true,
    status: 'online',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

statusRouter.get('/version', (_req, res) => {
  res.status(200).json({
    ok: true,
    version: env.appVersion
  });
});

export default statusRouter;
