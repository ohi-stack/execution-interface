# ONEGODIAN IDENTITY ENGINE™

Revenue-ready identity commerce platform built with Next.js + TypeScript + Tailwind + Stripe + Supabase + Resend.

For production deployment and launch gating, see [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## Product features

- User auth-ready flows (signup/signin pages + Supabase compatibility)
- Declaration Card + Obsidian Seal generation endpoint with free preview
- Paid HD unlock via Stripe Checkout
- Post-purchase webhook processing
- Email delivery API via Resend
- Member dashboard + download history endpoint
- Referral code generation and tracking hooks
- Admin analytics dashboard

## Folder structure

- `src/app/` UI routes + API route handlers
- `src/components/` reusable marketing + pricing components
- `src/lib/` stripe/supabase/env/auth helpers
- `db/schema.sql` Supabase/Postgres schema
- `.env.example` required environment variables

## Local setup

1. Install deps
   ```bash
   npm install
   ```
2. Copy env
   ```bash
   cp .env.example .env.local
   ```
3. Apply database schema in Supabase SQL editor (`db/schema.sql`).
4. Create Stripe prices for 12 / 49 / 199 USD and update env price IDs.
5. Configure Stripe webhook endpoint: `POST /api/webhooks/stripe`.
6. Start app:
   ```bash
   npm run dev
   ```

## Deployment guide (Vercel + Supabase, quick start)

1. Push folder to repository and import in Vercel as Next.js app.
2. Add all `.env.example` variables in Vercel project settings.
3. Set up Supabase project, run schema, and configure storage buckets for artifact files.
4. Set Stripe webhook endpoint to production URL:
   `https://<your-domain>/api/webhooks/stripe`
5. Configure Resend sending domain and update sender in `app/api/email/route.ts`.
6. Enable cron/scheduled jobs (optional) for referral payout sync and lifecycle reminders.

## Conversion optimization notes

- Primary CTA above fold on home page.
- Three-tier pricing grid with urgency-focused copy.
- Free preview gating before checkout.
- Fast checkout handoff via pre-built Stripe session URL.
- Post-purchase instant delivery + dashboard retrieval.


## Security hardening

- Set `ADMIN_TOKEN` to a random 32+ character value and send it via `x-admin-token` for `/admin` and `/api/admin/*` access.
- Do not reuse `ADMIN_EMAILS` as an auth secret; keep it for notification routing only.


## Hostinger deployment settings

- Framework: Next.js
- Install command: `npm ci`
- Build command: `npm run build`
- Start command: `npm run start`
- Node version: 20+
- Environment variable:
  - `NEXT_PUBLIC_API_BASE_URL=https://api.onegodian.org`
