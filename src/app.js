import express from 'express';
import healthRoutes from './routes/healthRoutes.js';
import registryRoutes from './routes/registryRoutes.js';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

export const createApp = () => {
  const app = express();

  app.use(express.json({ limit: '1mb' }));
  app.use(corsMiddleware);
  app.use(requestLogger);

  app.use(healthRoutes);
  app.use(registryRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
