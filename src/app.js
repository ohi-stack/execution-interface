import express from 'express';
import timeRoutes from './routes/timeRoutes.js';
import { healthHandler } from './controllers/timeController.js';

const app = express();

app.disable('x-powered-by');
app.use(express.json());

app.get('/health', healthHandler);
app.use('/v1/time', timeRoutes);

app.use((_req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found.',
    },
  });
});

app.use((error, _req, res, _next) => {
  console.error('Unhandled API error:', error);

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Unexpected server error.',
    },
  });
});

export default app;
