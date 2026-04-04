import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import portalRoutes from './routes/index.js';
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
  console.log(`[portal] ${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

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
  console.error('Unhandled portal error:', error);

  res.status(500).send(renderResultView({
    pageTitle: 'QR-V™ Verification',
    qrvid: 'Unavailable',
    verification: {
      status: 'UNAVAILABLE',
      message: 'Verification service unavailable',
      statusLabel: 'SERVICE UNAVAILABLE',
      badgeClass: 'badge-unavailable',
      subject: null,
      issuer: null,
      recordType: null,
      timestamp: null,
      hash: null,
      raw: { status: 'UNAVAILABLE', message: 'Verification service unavailable' },
    },
    errorSummary: 'An unexpected error occurred while rendering the verification portal.',
    autoVerify: false,
  }));
});

export default app;
