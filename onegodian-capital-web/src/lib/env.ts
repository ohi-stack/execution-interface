const DEFAULT_API_BASE_URL = 'https://api.onegodian.org';

export const publicEnv = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL,
};

export const serverEnv = {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  ADMIN_SECRET: process.env.ADMIN_SECRET,
  PRIVATE_API_KEYS: process.env.PRIVATE_API_KEYS,
};
