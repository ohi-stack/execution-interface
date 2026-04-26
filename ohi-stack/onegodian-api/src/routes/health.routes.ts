import { Router } from 'express';

const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    status: 'healthy',
    service: 'onegodian-api',
    timestamp: new Date().toISOString()
  });
});

export default healthRouter;
