import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/auth.js';
import issuerRoutes from './routes/issuer.js';
import recordsRoutes from './routes/records.js';
import verifyRoutes from './routes/verify.js';
import { closePool, isDatabaseConfigured, testDatabaseConnection } from './services/databaseService.js';
import { initializeRegistrySchema } from './services/registryService.js';

dotenv.config();

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';
const isProduction = process.env.NODE_ENV === 'production';
const enableNextUi = process.env.ENABLE_NEXT_UI !== 'false';
const hasNextApp = fs.existsSync(path.join(process.cwd(), 'app'));
const allowedUiOrigin = process.env.ISSUER_UI_ORIGIN || process.env.APP_BASE_URL || '';

const addRequestContext = (req, _res, next) => {
  req.requestId = crypto.randomUUID();
  next();
};

const requestLogger = (req, res, next) => {
  const startedAt = Date.now();
  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    console.log(
      `[${new Date().toISOString()}] [${req.requestId}] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`,
    );
  });
  next();
};

const buildHealthPayload = async () => {
  if (!isDatabaseConfigured()) {
    return {
      ok: true,
      api: 'online',
      database: 'unconfigured',
      mode: 'degraded',
      reason: 'DATABASE_URL is not configured.',
    };
  }

  const result = await testDatabaseConnection();
  return {
    ok: true,
    api: 'online',
    database: 'connected',
    mode: 'ready',
    time: result.now instanceof Date ? result.now.toISOString() : result.now,
  };
};

const createErrorResponder = () => (err, req, res, _next) => {
  console.error(`Unhandled application error for ${req.requestId}:`, err);

  if (['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'DB_NOT_CONFIGURED'].includes(err.code)) {
    return res.status(503).json({
      success: false,
      status: 'UNAVAILABLE',
      reason: err.code === 'DB_NOT_CONFIGURED'
        ? 'Registry database is not configured. Set DATABASE_URL and try again.'
        : 'Registry database is unreachable. Please try again later.',
    });
  }

  return res.status(500).json({
    success: false,
    error: err.message || 'Internal server error.',
  });
};

const createApiServer = () => {
  const server = express();

  server.disable('x-powered-by');
  server.use(express.json({ limit: '1mb' }));
  server.use(express.urlencoded({ extended: true }));
  server.use((req, res, next) => {
    if (allowedUiOrigin && req.headers.origin === allowedUiOrigin) {
      res.setHeader('Access-Control-Allow-Origin', allowedUiOrigin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    }

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }

    return next();
  });
  server.use(addRequestContext);
  server.use(requestLogger);

  server.get('/health', async (_req, res, next) => {
    try {
      const payload = await buildHealthPayload();
      return res.status(payload.mode === 'ready' ? 200 : 503).json(payload);
    } catch (error) {
      return next(error);
    }
  });

  server.get('/health/live', (_req, res) => {
    return res.status(200).json({ ok: true, api: 'online' });
  });

  server.get('/ping', (_req, res) => {
    return res.status(200).send('pong');
  });

  server.get('/health/ready', async (_req, res, next) => {
    try {
      if (!isDatabaseConfigured()) {
        return res.status(503).json({
          ok: false,
          api: 'online',
          database: 'unconfigured',
          reason: 'DATABASE_URL is not configured.',
        });
      }

      const result = await testDatabaseConnection();
      return res.status(200).json({
        ok: true,
        api: 'online',
        database: 'connected',
        time: result.now instanceof Date ? result.now.toISOString() : result.now,
      });
    } catch (error) {
      return next(error);
    }
  });

  server.get('/health/db', async (_req, res) => {
    try {
      const result = await testDatabaseConnection();
      return res.status(200).json({
        status: 'ok',
        db_time: result.now instanceof Date ? result.now.toISOString() : result.now,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  });

  server.get('/test-db', async (_req, res, next) => {
    try {
      const result = await testDatabaseConnection();
      return res.status(200).json({
        ok: true,
        time: result.now instanceof Date ? result.now.toISOString() : result.now,
      });
    } catch (error) {
      return next(error);
    }
  });

  server.use('/api/auth', authRoutes);
  server.use('/api/records', recordsRoutes);
  server.use('/api', issuerRoutes);
  server.use('/verify', verifyRoutes);

  return server;
};

const attachNextUi = async (server) => {
  if (!enableNextUi || !hasNextApp) {
    return false;
  }

  const nextModule = await import('next');
  const next = nextModule.default;
  const uiApp = next({ dev: !isProduction, dir: process.cwd() });
  await uiApp.prepare();
  const handle = uiApp.getRequestHandler();

  server.all('*', (req, res) => handle(req, res));
  return true;
};

const attachApiFallback = (server) => {
  server.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route not found.',
      path: req.originalUrl,
    });
  });
};

const startServer = async () => {
  let server;

  try {
    if (isDatabaseConfigured()) {
      await initializeRegistrySchema();
    } else {
      console.warn('DATABASE_URL is not configured. Verification and issuance routes will return 503 until it is set.');
    }

    server = createApiServer();

    let uiAttached = false;
    if (enableNextUi) {
      try {
        uiAttached = await attachNextUi(server);
      } catch (error) {
        console.warn('Next.js UI could not be attached; continuing in API-only mode.', error.message);
      }
    }

    if (!uiAttached) {
      attachApiFallback(server);
    }

    server.use(createErrorResponder());

    const listener = server.listen(port, host, () => {
      console.log(`QR-V backend listening on http://${host}:${port}`);
      console.log(`Mode: ${uiAttached ? 'api+ui' : 'api-only'}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    const shutdown = async (signal) => {
      console.log(`Received ${signal}, shutting down gracefully.`);
      listener.close(async () => {
        await closePool();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('Failed to start application:', error);
    await closePool();
    process.exit(1);
  }
};

await startServer();
