# onegodian-api

Production Node.js + TypeScript backend for **https://api.onegodian.org** with PostgreSQL + Prisma persistence.
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

## Local database setup

1. Copy env values:
   - `cp .env.example .env`
2. Start PostgreSQL:
   - `docker compose up -d postgres`
3. Install dependencies:
   - `npm ci`
4. Generate Prisma client:
   - `npm run prisma:generate`
5. Run migrations:
   - `npm run prisma:migrate:deploy`
6. Seed base product catalog:
   - `npm run prisma:seed`
7. Run checks/tests:
   - `npm run check`
   - `npm test`

## Required environment variables

- `NODE_ENV` (`development` | `test` | `production`)
- `PORT` (defaults to `3000` when omitted)
- `APP_URL`
- `DATABASE_URL`
- `DIRECT_URL` (recommended for migrations and deploy tooling)
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CORS_ORIGIN` (comma-separated allowlist)

## Prisma engine troubleshooting

Some restricted environments fail Prisma Rust engine downloads with `403 Forbidden` during `npx prisma generate`. This project uses `engineType = "client"` in `prisma/schema.prisma` to reduce dependence on binary fetches.

If your environment still fails:

1. Confirm network egress to Prisma package registry + npm is allowed.
2. Reinstall and retry generation:
   - `rm -rf node_modules package-lock.json && npm install`
   - `npm run prisma:generate`
3. Ensure CI/deploy sets `DATABASE_URL` (and `DIRECT_URL` when using migrations).
4. Run `npm run prisma:migrate:deploy` before running tests or starting the app.

## CI/deployment requirements

Your runtime pipeline must:

1. Provision reachable PostgreSQL.
2. Set environment values from `.env.example`.
3. Run `npm ci`.
4. Run `npx prisma generate`.
5. Run `npx prisma migrate deploy`.
6. Optionally seed: `npm run prisma:seed`.
7. Run `npm run check` and `npm test`.

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

## Deployment baseline
This service provides production readiness endpoints at `/health`, `/ready`, and `/version`. See `DEPLOYMENT.md` for deployment and rollback runbooks, and `SECURITY.md` for operational security policy.
