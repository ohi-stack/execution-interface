import { NextFunction, Request, Response } from 'express';

import { verifyAccessToken } from '../lib/auth';
import { MemberRole } from '../types/domain';

const unauthorized = (next: NextFunction, message: string) => {
  const error = new Error(message) as Error & { status?: number; code?: string };
  error.status = 401;
  error.code = 'unauthorized';
  next(error);
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    unauthorized(next, 'Missing bearer token');
    return;
  }

  try {
    const payload = verifyAccessToken(authHeader.replace('Bearer ', ''));
    req.auth = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role
    };
    next();
  } catch {
    unauthorized(next, 'Invalid or expired token');
  }
};

export const requireRole = (allowed: MemberRole[]) => (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.auth || !allowed.includes(req.auth.role)) {
    const error = new Error('Insufficient privileges') as Error & { status?: number; code?: string };
    error.status = 403;
    error.code = 'forbidden';
    next(error);
    return;
  }

  next();
};
