import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();

const app = express();

const allowedOrigins = new Set([
  'https://onegodian.org',
  'https://u.onegodian.org',
  'https://api.onegodian.org'
]);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('CORS origin denied'));
  },
  credentials: true
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false
  })
);
app.use(morgan('combined'));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'onegodian-api',
    timestamp: new Date().toISOString()
  });
});

app.get('/v1/status', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    version: 'v1'
  });
});

app.post('/v1/identity/verify', (_req: Request, res: Response) => {
  res.status(501).json({
    message: 'Identity verification endpoint placeholder. Implementation pending.'
  });
});

app.post('/v1/entitlements/check', (_req: Request, res: Response) => {
  res.status(501).json({
    message: 'Entitlements check endpoint placeholder. Implementation pending.'
  });
});

app.use((req: Request, _res: Response, next: NextFunction) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  (error as Error & { status?: number }).status = 404;
  next(error);
});

app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status ?? 500;

  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      status
    }
  });
});

export default app;
