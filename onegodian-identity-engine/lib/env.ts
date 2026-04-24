import { z } from 'zod';

const serverSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  ADMIN_EMAILS: z.string().min(1),
  ADMIN_API_TOKEN: z.string().min(16)
});

export function getEnv() {
  return serverSchema.parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://example.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'dev-anon-key',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'dev-service-role',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? 'sk_test_dev',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? 'whsec_dev',
    RESEND_API_KEY: process.env.RESEND_API_KEY ?? 're_dev',
    ADMIN_EMAILS: process.env.ADMIN_EMAILS ?? 'admin@onegodian.org',
    ADMIN_API_TOKEN: process.env.ADMIN_API_TOKEN ?? 'dev-admin-token-change-me'
  });
}
