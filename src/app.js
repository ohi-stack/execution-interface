import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import portalRoutes from './routes/index.js';
import executionV1Routes from './routes/api/executionV1Routes.js';
import { logError, logInfo } from './utils/logger.js';
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
  logInfo('http.request', { method: req.method, path: req.originalUrl, ip: req.ip });
  next();
});

app.use('/v1', executionV1Routes);
app.use('/', portalRoutes);

app.use((req, res) => {
  res.status(404).send(renderResultView({
    pageTitle: 'QR-V™ Verification',
    qrvid: req.path.replace(/^\//, '') || 'Unknown',
    verification: {
      status: 'NOT_FOUND',
      message: 'Record not found',
      statusLabel: 'NOT FOUND',
      badgeClass: 'badge-invalid',
      subject: null,
      issuer: null,
      recordType: null,
      timestamp: null,
      hash: null,
      raw: { status: 'NOT_FOUND', message: 'Record not found' },
    },
    errorSummary: 'The requested verification route does not exist.',
    autoVerify: false,
  }));
});

app.use((error, _req, res, _next) => {
  logError('http.unhandled_error', { error: error?.message || 'unknown' });

  res.status(500).send(renderResultView({
    pageTitle: 'QR-V™ Verification',
    qrvid: 'Unavailable',
    verification: {
      status: 'NOT_FOUND',
      message: 'Verification service unavailable',
      statusLabel: 'NOT_FOUND',
      badgeClass: 'badge-invalid',
      subject: null,
      issuer: null,
      recordType: null,
      timestamp: null,
      hash: null,
      raw: { status: 'NOT_FOUND', message: 'Verification service unavailable' },
    },
    errorSummary: 'An unexpected error occurred while rendering the verification portal.',
    autoVerify: false,
  }));
});

export default app;
