import dotenv from 'dotenv';
import app from './src/app.js';

dotenv.config();
const { env } = await import('./src/config/env.js');

const port = env.PORT;
const host = '0.0.0.0';

process.on('uncaughtException', (error) => {
  console.error('[fatal] uncaughtException', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('[fatal] unhandledRejection', reason);
});

const server = app.listen(port, host, () => {
  console.log(`[startup] QR-V Verification Portal listening on http://${host}:${port}`);
  console.log(`[startup] Environment: ${env.NODE_ENV}`);
  console.log(`[startup] Base URL: ${env.BASE_URL}`);
  console.log(`[startup] Verify base URL: ${env.VERIFY_BASE_URL}`);
  if (env.DATABASE_URL) {
    console.log('[startup] DATABASE_URL detected (connection is lazy and non-blocking)');
  } else {
    console.log('[startup] DATABASE_URL not set (using in-memory runtime store)');
  }
});

const shutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down QR-V Verification Portal.`);
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
