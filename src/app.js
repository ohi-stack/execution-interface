import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import portalRoutes from './routes/index.js';
import apiRoutes from './routes/apiRoutes.js';
import { renderResultView } from './views/resultView.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.disable('x-powered-by');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));

app.use((req, _res, next) => {
  console.log(`[execution-interface] ${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api', apiRoutes);
app.use('/', portalRoutes);

app.use((req, res) => {
  res.status(404).send(renderResultView({
    pageTitle: 'QR-V™ Verification',
    qrvid: req.path.replace(/^\//, '') || 'Unknown',
    verification: {
      status: 'INVALID',
      message: 'Record not found',
      statusLabel: 'INVALID',
      badgeClass: 'badge-invalid',
      subject: null,
      issuer: null,
      recordType: null,
      timestamp: null,
      hash: null,
      raw: { status: 'INVALID', message: 'Record not found' },
    },
    errorSummary: 'The requested verification route does not exist.',
    autoVerify: false,
  }));
});

app.use((error, _req, res, _next) => {
  console.error('Unhandled execution-interface error:', error);

  if (['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'DB_NOT_CONFIGURED'].includes(error.code)) {
    return res.status(503).json({
      status: 'UNAVAILABLE',
      reason: error.code === 'DB_NOT_CONFIGURED'
        ? 'Registry database is not configured. Set DATABASE_URL and try again.'
        : 'Registry not reachable. Please try again later.',
    });
  }

  if (error.name === 'SyntaxError' && error.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON payload.',
    });
  }

  return res.status(500).json({
    success: false,
    error: 'Internal server error.',
  });
});

export default app;
