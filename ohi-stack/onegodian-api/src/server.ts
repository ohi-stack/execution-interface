import http from 'http';

import app from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';
import { logger } from './middleware/security';

const server = http.createServer(app);

server.listen(env.port, () => {
  logger.info({ port: env.port }, 'onegodian-api listening');
});

const gracefulShutdown = (signal: NodeJS.Signals) => {
  logger.info({ signal }, 'graceful shutdown started');

  server.close(async (error) => {
    if (error) {
      logger.error({ err: error }, 'error while closing server');
      process.exit(1);
    }

    await prisma.$disconnect();
    logger.info('server closed and prisma disconnected');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('forced shutdown due to timeout');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

export default server;
