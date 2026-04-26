import cors, { CorsOptions } from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import pino from 'pino';

import { env } from '../config/env';

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || env.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('CORS origin denied'));
  },
  credentials: true
};

const logger = pino({
  level: env.isProduction ? 'info' : 'debug'
});

export const securityMiddleware = [
  helmet(),
  cors(corsOptions),
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false
  }),
  express.json({ limit: '1mb' }),
  pinoHttp({ logger })
];

export { logger };
