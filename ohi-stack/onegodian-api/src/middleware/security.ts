import compression from 'compression';
import cors, { CorsOptions } from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pino from 'pino';
import pinoHttp from 'pino-http';

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
  compression(),
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false
  }),
  express.json({
    limit: '1mb',
    verify: (req, _res, buf) => {
      const request = req as { url?: string; rawBody?: Buffer };
      if (request.url?.startsWith('/billing/webhook')) {
        request.rawBody = Buffer.from(buf);
      }
    }
  }),
  express.urlencoded({ extended: false, limit: '1mb' }),
  pinoHttp({ logger })
];

export { logger };
