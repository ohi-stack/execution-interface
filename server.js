import dotenv from 'dotenv';
import express from 'express';
import recordsRouter from './routes/records.js';
import verifyRouter from './routes/verify.js';
import { closePool, isDatabaseConfigured, testDatabaseConnection } from './services/databaseService.js';
import { initializeRegistrySchema } from './services/registryService.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;
const host = '0.0.0.0';

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/health', async (_req, res, next) => {
  try {
    if (!isDatabaseConfigured()) {
      return res.status(503).json({
        ok: false,
        database: 'unconfigured',
        reason: 'DATABASE_URL is not configured.',
      });
    }

    const result = await testDatabaseConnection();

    return res.status(200).json({
      ok: true,
      database: 'connected',
      time: result.now instanceof Date ? result.now.toISOString() : result.now,
    });
  } catch (error) {
    return next(error);
  }
});

app.get('/test-db', async (_req, res, next) => {
  try {
    const result = await testDatabaseConnection();
    return res.status(200).json({ time: result.now instanceof Date ? result.now.toISOString() : result.now });
  } catch (error) {
    return next(error);
  }
});

app.use('/records', recordsRouter);
app.use('/verify', verifyRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled application error:', err);

  if (['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'DB_NOT_CONFIGURED'].includes(err.code)) {
    return res.status(503).json({
      status: 'UNAVAILABLE',
      reason: err.code === 'DB_NOT_CONFIGURED'
        ? 'Registry database is not configured. Set DATABASE_URL and try again.'
        : 'Registry not reachable. Please try again later.',
    });
  }

  return res.status(500).json({
    success: false,
    error: 'Internal server error.',
  });
});

const startServer = async () => {
  try {
    if (isDatabaseConfigured()) {
      await initializeRegistrySchema();
    } else {
      console.warn('DATABASE_URL is not configured. Database-backed routes will return a 503 until it is set.');
    }

    const server = app.listen(port, host, () => {
      console.log(`QR-V Verification API listening on http://${host}:${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Verify base URL: ${process.env.VERIFY_BASE_URL || 'https://verify.qrv.network'}`);
    });

    const shutdown = async () => {
      server.close(async () => {
        await closePool();
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start application:', error);
    await closePool();
    process.exit(1);
  }
};

await startServer();
