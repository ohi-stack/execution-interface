import dotenv from 'dotenv';
import { AppError } from '../utils/appError.js';

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

const parsePort = (value) => {
  const port = Number.parseInt(value ?? '3000', 10);

  if (!Number.isInteger(port) || port <= 0) {
    throw new AppError(500, 'INVALID_PORT', 'PORT must be a positive integer.');
  }

  return port;
};

export const env = {
  port: parsePort(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL ?? '',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  registryBaseUrl: process.env.REGISTRY_BASE_URL ?? 'http://localhost:3000',
  allowedOrigins: parseAllowedOrigins(process.env.ALLOWED_ORIGINS),
};

export const isProduction = env.nodeEnv === 'production';

export const validateRequiredEnv = () => {
  const missing = [];

  if (!env.databaseUrl) {
    missing.push('DATABASE_URL');
  }

  if (!env.registryBaseUrl) {
    missing.push('REGISTRY_BASE_URL');
  }

  if (missing.length > 0) {
    throw new AppError(
      500,
      'ENV_CONFIGURATION_ERROR',
      'Required environment variables are missing.',
      { missing },
    );
  }
};
