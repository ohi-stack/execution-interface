# ONEGODIAN IDENTITY ENGINE — Deployment Runbook

This runbook is for deploying `onegodian-identity-engine/` to Vercel or Hostinger-style Node hosting.

## 1) App root and commands

- **App root:** `onegodian-identity-engine`
- **Install:** `npm ci`
- **Build:** `npm run build`
- **Start:** `npm run start`
- **Node version:** 20.x LTS recommended

For monorepo platforms, make sure the project root points to this folder (not repo root).

## 2) Production environment checklist

Set these variables in production (exact names):

### Public variables (safe for browser)

- `NEXT_PUBLIC_SITE_URL` (e.g. `https://identity.example.com`)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Server-only secrets

- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_PREMIUM`
- `STRIPE_PRICE_FOUNDER`
- `RESEND_API_KEY`
- `ADMIN_EMAILS`

## 3) Webhook endpoint

- **Stripe webhook endpoint:** `POST https://<your-domain>/api/webhooks/stripe`
- Subscribe at minimum to:
  - `checkout.session.completed`

Webhook signing secret from Stripe must match `STRIPE_WEBHOOK_SECRET`.

## 4) Hostinger / generic Node hosting notes

If you are not deploying to Vercel:

1. Set app directory to `onegodian-identity-engine`.
2. Install dependencies with `npm ci`.
3. Build with `npm run build`.
4. Start with `npm run start` (default Next.js port handling via `PORT`).
5. Reverse proxy to Node process and enforce HTTPS.
6. Add all env vars before first boot.
7. Configure Stripe webhook to your public HTTPS domain.

## 5) Pre-launch verification checklist

Run after deploy:

1. Home page and marketing routes: `/`, `/about`, `/pricing`, `/faq`
2. Funnel: `/create` → `/api/generate` → `/api/checkout/create-session`
3. Stripe webhook delivery (real event): `/api/webhooks/stripe`
4. Admin page access: `/admin`
5. Admin metrics API: `/api/admin/metrics`
6. Downloads API: `/api/downloads?userId=<uuid>`
7. Referral API: `/api/referrals`
8. Email API: `/api/email`

## 6) Known production risks (must review)

1. **Admin auth design is weak**: middleware currently checks `x-admin-token` against `ADMIN_EMAILS`; this is not a robust authentication model.
2. **Admin metrics API is unauthenticated**: `/api/admin/metrics` can be called directly without middleware checks.
3. **User-data APIs rely on caller-provided identifiers**: `/api/downloads` accepts `userId` query input and does not verify caller identity.
4. **Email API is open to server-side abuse**: `/api/email` does not require auth/rate limit.
5. **Referral code generation uses `Math.random()`**: can lead to predictable/duplicate code patterns under scale.
6. **Placeholder artifacts are returned by generate flow**: `/api/generate` currently returns static placeholder SVG URLs.
7. **Dashboard values are static placeholders**: `/dashboard` is not wired to live purchase/download/referral data.

## 7) Recommended minimum hardening before public launch

1. Add strong authz for `/admin` and `/api/admin/*` (Supabase session + role check).
2. Require verified user tokens on `/api/downloads`, `/api/referrals`, and `/api/email`.
3. Add rate limiting and abuse protection to write endpoints.
4. Replace placeholder asset generation with real artifact pipeline.
5. Add structured error logging/observability for Stripe, Supabase, and Resend failures.
6. Add idempotency handling for webhook processing to avoid duplicate side effects.
