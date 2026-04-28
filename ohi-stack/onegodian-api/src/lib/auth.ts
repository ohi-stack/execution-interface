import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { MemberRole, User } from '../types/domain';

type AuthTokenPayload = {
  sub: string;
  email: string;
  role: MemberRole;
};

export const hashPassword = async (value: string): Promise<string> => bcrypt.hash(value, 12);

export const comparePassword = async (value: string, hash: string): Promise<boolean> => bcrypt.compare(value, hash);

export const createAccessToken = (user: User): string => {
  const payload: AuthTokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): AuthTokenPayload => {
  const decoded = jwt.verify(token, env.jwtSecret);
  if (typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }

  return decoded as AuthTokenPayload;
};
