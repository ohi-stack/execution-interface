import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const optionalNonEmpty = z.string().trim().min(1).optional();

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
  APP_NAME: z.string().default('onegodian-service'),
  APP_URL: z.string().url('APP_URL must be a valid URL'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL').optional(),
  DIRECT_URL: z.string().url('DIRECT_URL must be a valid URL').optional(),
  STRIPE_SECRET_KEY: optionalNonEmpty,
  STRIPE_WEBHOOK_SECRET: optionalNonEmpty,
  STRIPE_PRICE_MONTHLY: optionalNonEmpty,
  STRIPE_PRICE_PRO: optionalNonEmpty,
  STRIPE_PRICE_FOUNDER: optionalNonEmpty,
  CORS_ORIGIN: z.string().optional(),
  CORS_ORIGINS: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
  throw new Error(`Invalid environment configuration: ${details}`);
}

const corsOriginValue = parsed.data.CORS_ORIGIN ?? parsed.data.CORS_ORIGINS;
if (!corsOriginValue) {
  throw new Error('Invalid environment configuration: set CORS_ORIGIN (or legacy CORS_ORIGINS)');
}

const corsOrigins = corsOriginValue.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (corsOrigins.length === 0) {
  throw new Error('Invalid environment configuration: CORS_ORIGIN must include at least one valid origin');
}

export const env = {
  nodeEnv: parsed.data.NODE_ENV,
  isProduction: parsed.data.NODE_ENV === 'production',
  port: parsed.data.PORT,
  appName: parsed.data.APP_NAME,
  appUrl: parsed.data.APP_URL,
  jwtSecret: parsed.data.JWT_SECRET,
  databaseUrl: parsed.data.DATABASE_URL,
  directUrl: parsed.data.DIRECT_URL,
  stripeSecretKey: parsed.data.STRIPE_SECRET_KEY,
  stripeWebhookSecret: parsed.data.STRIPE_WEBHOOK_SECRET,
  stripePrices: {
    monthly: parsed.data.STRIPE_PRICE_MONTHLY,
    pro: parsed.data.STRIPE_PRICE_PRO,
    founder: parsed.data.STRIPE_PRICE_FOUNDER
  },
  corsOrigins,
  appVersion: process.env.npm_package_version ?? '1.0.0'
} as const;
