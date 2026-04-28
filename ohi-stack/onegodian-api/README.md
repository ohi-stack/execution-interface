# onegodian-api

Production Node.js + TypeScript backend for **https://api.onegodian.org**.

## Stack

- Express
- Helmet
- CORS allowlist
- Compression
- Trust proxy
- Request size limits
- Rate limiting
- Pino request logging
- Dotenv + Zod environment validation
- PostgreSQL persistence via Prisma ORM
- Centralized structured error handling
- JWT auth + role guards
- Stripe checkout + webhook handlers

## Required environment variables

Copy `.env.example` to `.env` and edit values:

- `NODE_ENV` (`development` | `test` | `production`)
- `PORT` (defaults to `3000` when omitted)
- `APP_URL`
- `JWT_SECRET`
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` (recommended)
- `CORS_ORIGINS` (comma-separated allowed origins)

## Deployment + security docs

- [Staging deployment runbook](./STAGING_DEPLOYMENT.md)
- [Staging acceptance checklist](./STAGING_ACCEPTANCE.md)
- [Security notes](./SECURITY_NOTES.md)

## Prisma generate reliability (CI + staging)

If `npm run prisma:generate` fails with Prisma engine download errors (for example `403 Forbidden` from `binaries.prisma.sh`), use this checklist:

1. Ensure the CI/deploy environment has outbound network access for Prisma engine downloads.
2. If direct access is blocked, configure `PRISMA_ENGINES_MIRROR` to an approved internal mirror.
3. Run installs with network access using `npm ci` before Prisma commands.
4. Keep secrets out of logs and code; never print or commit `DATABASE_URL` values.

Recommended CI-safe sequence:

```bash
npm ci
npx prisma generate
npm run check
npm test
```

For debugging environment readiness without exposing secrets:

```bash
npm run prisma:doctor
```

## API endpoints

### Core + Ops
- `GET /`
- `GET /health`
- `GET /ready`
- `GET /metrics`
- `GET /api/status`
- `GET /api/version`

### Membership + Auth
- `POST /api/members/signup`
- `POST /api/members/login`
- `GET /api/members/me`

### Billing
- `POST /billing/checkout`
- `POST /billing/webhook`
- `GET /billing/status`

### Digital Products
- `GET /api/products`
- `POST /api/products/checkout`
- `GET /api/products/downloads/:token`

### Admin
- `GET /admin/stats`

### Existing placeholders/system
- `POST /api/agents/execute`
- `POST /api/twin/execute`
- `POST /api/workflows/run`
- `GET /api/system/capabilities`
- `GET /api/system/registry`

All endpoints return JSON.

## Database (PostgreSQL + Prisma)

- Schema: `prisma/schema.prisma`
- Migration SQL: `prisma/migrations/202604280001_init/migration.sql`
- Seed script: `prisma/seed.ts` (upserts default products)

Run in production deploys:

```bash
npm run prisma:generate
npm run prisma:migrate:deploy
npm run prisma:seed
```
