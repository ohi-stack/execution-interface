import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),

  APP_NAME: z.string().default('onegodian-api'),
  APP_URL: z.string().url(),
  PUBLIC_APP_URL: z.string().url(),
  API_BASE_URL: z.string().url(),

  API_KEY: z.string().min(10),
  JWT_SECRET: z.string().min(16),
  CORS_ORIGIN: z.string(),

  DATABASE_URL: z.string().optional(),
  ENABLE_DATABASE: z.coerce.boolean().default(false),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  OT_STANDARD: z.literal('OTS-V5').default('OTS-V5'),
  OT_EPOCH: z.string().date(),
  OT_WEEK_START: z.literal('SKENRA_SUNDAY').default('SKENRA_SUNDAY'),
  OT_DEFAULT_TIMEZONE: z.string().default('America/New_York'),
  OT_STORE_UTC: z.coerce.boolean().default(true),

  ENABLE_CALENDAR: z.coerce.boolean().default(true),
  ENABLE_SCHEDULER: z.coerce.boolean().default(true),
  ENABLE_ODIN: z.coerce.boolean().default(true),
  ENABLE_CAPITAL_API: z.coerce.boolean().default(false),

  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info')
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ ENV VALIDATION FAILED');
  console.error(parsed.error.format());
  throw new Error('Invalid environment variables');
}

export const ENV = parsed.data;

export const CORS_ORIGINS = ENV.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);
