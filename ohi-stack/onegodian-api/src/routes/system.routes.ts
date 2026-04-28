import { Router } from 'express';

const systemRouter = Router();

systemRouter.get('/capabilities', (_req, res) => {
  res.status(200).json({
    ok: true,
    capabilities: [
      'health-monitoring',
      'status-reporting',
      'version-reporting',
      'membership-auth',
      'subscription-billing',
      'digital-product-fulfillment',
      'admin-metrics',
      'agent-execution-placeholder',
      'twin-execution-placeholder',
      'workflow-run-placeholder',
      'system-registry'
    ]
  });
});

systemRouter.get('/registry', (_req, res) => {
  res.status(200).json({
    ok: true,
    registry: {
      service: 'onegodian-api',
      routes: [
        'GET /',
        'GET /health',
        'GET /ready',
        'GET /metrics',
        'GET /api/status',
        'GET /api/version',
        'POST /api/members/signup',
        'POST /api/members/login',
        'GET /api/members/me',
        'POST /billing/checkout',
        'POST /billing/webhook',
        'GET /billing/status',
        'GET /api/products',
        'POST /api/products/checkout',
        'GET /api/products/downloads/:token',
        'GET /admin/stats',
        'POST /api/agents/execute',
        'POST /api/twin/execute',
        'POST /api/workflows/run',
        'GET /api/system/capabilities',
        'GET /api/system/registry'
      ]
    }
  });
});

export default systemRouter;
