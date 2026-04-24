import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import portalRoutes from './routes/index.js';
import { renderResultView } from './views/resultView.js';
import { validateEnvironment } from './services/envValidation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envStatus = validateEnvironment();
const app = express();

app.disable('x-powered-by');

const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOriginValidator = (origin, callback) => {
  if (!origin) {
    return callback(null, true);
  }

  if (corsOrigins.length === 0) {
    return callback(process.env.NODE_ENV === 'production' ? new Error('Origin not allowed') : null, process.env.NODE_ENV !== 'production');
  }

  return callback(corsOrigins.includes(origin) ? null : new Error('Origin not allowed'), corsOrigins.includes(origin));
};

app.use(cors({ origin: corsOriginValidator }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));

app.use((req, _res, next) => {
  console.log(`[portal] ${new Date().toISOString()} ${req.method} ${req.originalUrl} env=${envStatus.nodeEnv}`);
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

app.use((error, req, res, _next) => {
  console.error('Unhandled portal error:', error);

  if (req.path.startsWith('/api/')) {
    return res.status(500).json({
      error: 'Internal server error',
      code: error.code || 'INTERNAL_ERROR',
      details: [error.message],
      timestamp_utc: new Date().toISOString(),
    });
  }

  return res.status(500).send(renderResultView({
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
