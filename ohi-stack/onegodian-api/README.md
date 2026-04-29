# onegodian-api

Production Node.js + TypeScript backend for ONEGODIAN, LLC API services.

## Production
- Production URL: `https://api.onegodian.org`
- Stripe webhook endpoint: `https://api.onegodian.org/billing/webhook`

## Stack
- Express + TypeScript
- Prisma + PostgreSQL (optional while mock billing mode is used)
- Stripe Checkout + Webhooks
- Helmet, CORS allowlist, compression
- `express-rate-limit` for global throttling
- `pino-http` structured request logging
- JWT auth + role guards

## Install, check, test, start
```bash
npm ci
npm run check
npm test
npm run build
npm start
```

## Required environment variables
- `PORT`
- `NODE_ENV`
- `APP_URL`
- `CORS_ORIGIN`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY` (required for live Stripe mode)
- `STRIPE_WEBHOOK_SECRET` (required for signed Stripe webhooks)
- `STRIPE_PRICE_MONTHLY`
- `STRIPE_PRICE_PRO`
- `STRIPE_PRICE_FOUNDER`
- `DATABASE_URL` (optional)

## Billing modes
- **Stripe mode**: enabled only when `STRIPE_SECRET_KEY` and all `STRIPE_PRICE_*` values are configured.
- **Mock mode**: automatic fallback when Stripe keys/prices are missing (safe for local/dev).

## Stripe dashboard setup
1. Create 3 recurring prices in Stripe for monthly/pro/founder plans.
2. Copy each `price_...` ID to:
   - `STRIPE_PRICE_MONTHLY`
   - `STRIPE_PRICE_PRO`
   - `STRIPE_PRICE_FOUNDER`
3. Copy API secret key to `STRIPE_SECRET_KEY`.
4. Add webhook endpoint in Stripe Dashboard:
   - URL: `https://api.onegodian.org/billing/webhook`
   - Events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
5. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`.

## Post-deploy smoke tests
```bash
curl -i https://api.onegodian.org/health
curl -i https://api.onegodian.org/version
curl -i -X POST https://api.onegodian.org/billing/checkout -H 'content-type: application/json' -d '{"plan":"monthly"}'
API_BASE_URL=https://api.onegodian.org npm run smoke:live
```

## Deployment
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for Render, Railway, VPS, and Docker workflows.
- Use `.env.production.postgres.example` as production env template.
