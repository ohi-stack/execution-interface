import express from 'express';

import { requireAuth, requireRole } from './middleware/auth';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { securityMiddleware } from './middleware/security';
import adminRouter from './routes/admin.routes';
import agentsRouter from './routes/agents.routes';
import billingRouter from './routes/billing.routes';
import healthRouter from './routes/health.routes';
import membersRouter from './routes/members.routes';
import productsRouter from './routes/products.routes';
import statusRouter from './routes/status.routes';
import systemRouter from './routes/system.routes';
import twinRouter from './routes/twin.routes';
import workflowsRouter from './routes/workflows.routes';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(securityMiddleware);

app.get('/', (_req, res) => {
  res.status(200).json({
    ok: true,
    service: 'onegodian-api',
    docs: '/api/system/registry'
  });
});

app.use(healthRouter);
app.use('/api', statusRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/twin', twinRouter);
app.use('/api/workflows', workflowsRouter);
app.use('/api/system', systemRouter);
app.use('/api/members', membersRouter);
app.use('/billing', billingRouter);
app.use('/api/products', requireAuth, productsRouter);
app.use('/admin', requireAuth, requireRole(['admin']), adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
