import crypto from 'node:crypto';
import { getEnv } from '@/lib/env';

const env = getEnv();

const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
};

export const isAdminRequest = (adminToken: string | null) => {
  if (!adminToken) {
    return false;
  }

  return safeEqual(adminToken, env.ADMIN_TOKEN);
};
