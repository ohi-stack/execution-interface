import { Router } from 'express';
import { z } from 'zod';

import { comparePassword, createAccessToken, hashPassword } from '../lib/auth';
import { requireAuth } from '../middleware/auth';
import { store } from '../lib/store';

const router = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

router.post('/signup', async (req, res, next) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    const error = new Error('Request validation failed') as Error & { status?: number; code?: string; details?: unknown };
    error.status = 400;
    error.code = 'validation_error';
    error.details = parsed.error.flatten();
    next(error);
    return;
  }

  if (store.findUserByEmail(parsed.data.email)) {
    const error = new Error('Email already registered') as Error & { status?: number; code?: string };
    error.status = 409;
    error.code = 'conflict';
    next(error);
    return;
  }

  const user = store.createUser({
    email: parsed.data.email,
    name: parsed.data.name,
    passwordHash: await hashPassword(parsed.data.password),
    role: 'free'
  });

  const token = createAccessToken(user);

  res.status(201).json({
    ok: true,
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  });
});

router.post('/login', async (req, res, next) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    const error = new Error('Request validation failed') as Error & { status?: number; code?: string; details?: unknown };
    error.status = 400;
    error.code = 'validation_error';
    error.details = parsed.error.flatten();
    next(error);
    return;
  }

  const user = store.findUserByEmail(parsed.data.email);
  if (!user || !(await comparePassword(parsed.data.password, user.passwordHash))) {
    const error = new Error('Invalid credentials') as Error & { status?: number; code?: string };
    error.status = 401;
    error.code = 'unauthorized';
    next(error);
    return;
  }

  const token = createAccessToken(user);

  res.status(200).json({
    ok: true,
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  });
});

router.get('/me', requireAuth, (req, res, next) => {
  if (!req.auth) {
    const error = new Error('Missing auth context') as Error & { status?: number; code?: string };
    error.status = 401;
    error.code = 'unauthorized';
    next(error);
    return;
  }

  const user = store.users.get(req.auth.userId);
  if (!user) {
    const error = new Error('User not found') as Error & { status?: number; code?: string };
    error.status = 404;
    error.code = 'not_found';
    next(error);
    return;
  }

  res.status(200).json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  });
});

export default router;
