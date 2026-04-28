# Staging Deployment Runbook

This runbook prepares the Prisma-backed `onegodian-api` service for a staging deployment.

## 1) Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL instance reachable from staging runtime
- Stripe test-mode account and webhook endpoint configured for staging
- Access to staging secret manager (do **not** store production secrets in repo)

## 2) Required environment variables

Set these values in your staging environment or secret manager before deployment:

- `DATABASE_URL` - PostgreSQL connection string for staging database
- `APP_URL` - Public base URL for staging app/API (for links/callback context)
- `JWT_SECRET` - Strong random secret for signing auth tokens
- `STRIPE_SECRET_KEY` - Stripe API secret key for staging/test mode
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret for staging webhook endpoint
- `NODE_ENV` - Use `production` for deployed staging runtime
- `PORT` - HTTP listen port used by platform/runtime

## 3) Deployment checklist

Run these commands in order from repository root:

1. Install dependencies:
   ```bash
   npm ci
   ```
2. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
3. Apply committed migrations:
   ```bash
   npm run prisma:migrate:deploy
   ```
4. Seed baseline data:
   ```bash
   npm run prisma:seed
   ```
5. Run type checks:
   ```bash
   npm run check
   ```
6. Run tests:
   ```bash
   npm test
   ```
7. Build app bundle:
   ```bash
   npm run build
   ```
8. Start service:
   ```bash
   npm start
   ```

### Prisma generation troubleshooting (403/download failures)

If Prisma generation fails while downloading engines:

- Confirm staging/CI network policy allows Prisma engine downloads.
- If needed, set `PRISMA_ENGINES_MIRROR` to a trusted internal mirror endpoint.
- Re-run from a clean install in a network-enabled environment:
  ```bash
  npm ci
  npx prisma generate
  npm run check
  npm test
  ```
- Use diagnostics without leaking secret values:
  ```bash
  npm run prisma:doctor
  ```
- Never print or commit secret environment variable values (especially `DATABASE_URL`).

## 4) Post-deploy verification checklist

After the app is live in staging, verify the following in order:

1. **Health check**: `GET /health` returns `200`.
2. **Readiness check**: `GET /ready` returns `200` and indicates dependencies are ready.
3. **Signup flow**: Create a new staging user account.
4. **Login flow**: Authenticate with that user and confirm JWT issuance.
5. **Current member endpoint**: Call `GET /api/members/me` with auth token.
6. **Product listing**: Call `GET /api/products` and verify seeded products are returned.
7. **Checkout session**: Create a checkout via `POST /api/products/checkout` (or billing checkout route used by client).
8. **Stripe webhook activation**: Confirm webhook event updates subscription state in DB.
9. **Download token validation**: Verify product download token accepts valid token and rejects expired/invalid tokens.
10. **Admin stats**: Call `GET /admin/stats` with admin credentials and verify metrics payload.

For the full end-to-end acceptance path (deploy, migrations, seed, member lifecycle, Stripe webhook, product purchase, token expiry, admin aggregation, restart persistence), run the checklist in [`STAGING_ACCEPTANCE.md`](./STAGING_ACCEPTANCE.md).

## 5) Rollback procedure

### Database backup requirement

- Take and verify a staging database backup/snapshot **before** running `npm run prisma:migrate:deploy`.

### Migration rollback warning

- Prisma migrations are forward-only by default.
- A rollback typically requires restoring database from backup and redeploying prior app version.
- Do not attempt ad-hoc SQL rollback in staging unless reviewed by a database owner.

### App rollback steps

1. Identify last known good build/commit.
2. Reconfigure deployment target to that build (or redeploy prior image/artifact).
3. If the latest migration introduced incompatible schema changes, restore the pre-deploy DB backup.
4. Re-run smoke checks (`/health`, `/ready`, auth flow, core API routes).
5. Document incident timeline and follow-up actions.
