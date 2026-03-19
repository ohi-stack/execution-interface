import { createApp } from './app.js';
import { env, validateRequiredEnv } from './config/env.js';
import { logger } from './config/logger.js';
import { runMigrations } from './db/migrator.js';
import { closePool } from './db/pool.js';

const app = createApp();

const startServer = async () => {
  validateRequiredEnv();
  await runMigrations();

  const server = app.listen(env.port, () => {
    logger.info('QR-V registry service started.', {
      port: env.port,
      nodeEnv: env.nodeEnv,
      registryBaseUrl: env.registryBaseUrl,
    });
  });

  const shutdown = async () => {
    logger.info('Shutting down QR-V registry service.');
    server.close(async () => {
      await closePool();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

startServer().catch(async (error) => {
  logger.error('Failed to start QR-V registry service.', { error: error.message, details: error.details ?? null });
  await closePool();
  process.exit(1);
});
