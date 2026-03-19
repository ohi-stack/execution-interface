import { logger } from '../config/logger.js';

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      requestId: res.locals.requestId,
    },
  });
};

export const errorHandler = (error, _req, res, _next) => {
  const mappedDatabaseErrors = {
    '23505': { statusCode: 409, code: 'CONFLICT', message: 'A unique registry constraint was violated.' },
    '23503': { statusCode: 400, code: 'FOREIGN_KEY_VIOLATION', message: 'A referenced registry resource does not exist.' },
    '22P02': { statusCode: 400, code: 'INVALID_INPUT', message: 'One or more values were not formatted correctly.' },
  };

  const mapped = mappedDatabaseErrors[error.code];
  const statusCode = error.statusCode ?? mapped?.statusCode ?? 500;
  const code = mapped?.code ?? error.code ?? 'INTERNAL_SERVER_ERROR';
  const message = mapped?.message ?? error.message ?? 'Internal server error.';

  logger.error('Unhandled application error.', {
    requestId: res.locals.requestId,
    code,
    message,
    details: error.details ?? null,
    stack: error.stack,
  });

  res.status(statusCode).json({
    error: {
      code,
      message,
      requestId: res.locals.requestId,
      ...(error.details ? { details: error.details } : {}),
    },
  });
};
