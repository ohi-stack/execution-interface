import { NextFunction, Request, Response } from 'express';

import { env } from '../config/env';

type HttpError = Error & { status?: number };

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  const error: HttpError = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

export const errorHandler = (err: HttpError, _req: Request, res: Response, _next: NextFunction): void => {
  const status = err.status ?? 500;

  res.status(status).json({
    ok: false,
    error: {
      message: status === 500 && env.isProduction ? 'Internal Server Error' : err.message,
      status
    }
  });
};
