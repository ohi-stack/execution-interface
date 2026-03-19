import { env } from '../config/env.js';

export const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;

  if (origin && (env.allowedOrigins.length === 0 || env.allowedOrigins.includes(origin))) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  }

  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
};
