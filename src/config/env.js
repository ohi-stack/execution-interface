import dotenv from 'dotenv';

dotenv.config();

const parseAllowedOrigins = (value) => {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const env = {
  port: Number.parseInt(process.env.PORT ?? '3000', 10),
  databaseUrl: process.env.DATABASE_URL ?? '',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  registryBaseUrl: process.env.REGISTRY_BASE_URL ?? 'http://localhost:3000',
  allowedOrigins: parseAllowedOrigins(process.env.ALLOWED_ORIGINS),
};

export const isProduction = env.nodeEnv === 'production';
