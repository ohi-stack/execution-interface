import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { env } from '../config/env';

type HttpError = Error & {
  code?: string;
  details?: unknown;
  status?: number;
};

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  const error: HttpError = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  error.code = 'not_found';
  next(error);
};

export const errorHandler = (err: HttpError, req: Request, res: Response, _next: NextFunction): void => {
  const isValidationError = err instanceof ZodError || err.code === 'validation_error';
  const status = isValidationError ? 400 : (err.status ?? 500);
  const code = isValidationError ? 'validation_error' : (err.code ?? 'internal_error');
  const message = status === 500 && env.isProduction ? 'Internal Server Error' : err.message;

  if (status >= 500) {
    req.log?.error({ err }, 'request failed');
  }

  res.status(status).json({
    ok: false,
    error: {
      code,
      message,
      status,
      details: isValidationError
        ? ((err instanceof ZodError ? err.flatten() : (err as HttpError).details) ?? undefined)
        : undefined,
      stack: env.isProduction ? undefined : err.stack
    }
  });
};
