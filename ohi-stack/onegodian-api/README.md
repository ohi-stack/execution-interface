# onegodian-api

Production Node.js + TypeScript backend for **https://api.onegodian.org** with PostgreSQL + Prisma persistence.

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
