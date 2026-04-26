import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) {
        return 3000;
      }

      return Number(value);
    })
    .refine((value) => Number.isInteger(value) && value > 0 && value < 65536, {
      message: 'PORT must be a valid TCP port number'
    }),
  CORS_ORIGINS: z
    .string()
    .min(1, 'CORS_ORIGINS is required (comma-separated list of allowed origins)')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
  throw new Error(`Invalid environment configuration: ${details}`);
}

const corsOrigins = parsed.data.CORS_ORIGINS.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (corsOrigins.length === 0) {
  throw new Error('Invalid environment configuration: CORS_ORIGINS must include at least one valid origin');
}

export const env = {
  nodeEnv: parsed.data.NODE_ENV,
  isProduction: parsed.data.NODE_ENV === 'production',
  port: parsed.data.PORT,
  corsOrigins,
  appVersion: process.env.npm_package_version ?? '1.0.0'
} as const;
