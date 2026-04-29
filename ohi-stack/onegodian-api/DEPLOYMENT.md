# Deployment Guide

## Local run
1. Copy `.env.example` to `.env` and fill required secrets.
2. Install dependencies: `npm ci`.
3. Generate Prisma client: `npm run prisma:generate`.
4. Validate code: `npm run check`.
5. Run tests: `npm test`.
6. Start API: `npm start`.

## Production PostgreSQL template
Use `.env.production.postgres.example` as your starting point and set secure values in your host secret manager.

## Environment variables
- `NODE_ENV`, `PORT`, `APP_NAME`, `APP_URL`
- `DATABASE_URL`, `DIRECT_URL`
- `JWT_SECRET`, `API_KEY`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `CORS_ORIGIN`, `LOG_LEVEL`
- Optional seed bootstrap: `SEED_ADMIN_EMAIL`, `SEED_ADMIN_NAME`, `SEED_ADMIN_PASSWORD_HASH`

## Deployment sequence (Render / Railway / VPS)
1. `npm ci`
2. `npm run prisma:generate`
3. `npm run build`
4. `npm run prisma:migrate:deploy`
5. `npm run prisma:seed` (optional but recommended)
6. `npm start`

## Render
- Build command: `npm ci && npm run prisma:generate && npm run build`
- Start command: `npm run prisma:migrate:deploy && npm start`
- Add all env vars from `.env.production.postgres.example`.
- Provision managed PostgreSQL and map `DATABASE_URL` / `DIRECT_URL`.

## Railway
- Build command: `npm ci && npm run prisma:generate && npm run build`
- Start command: `npm run prisma:migrate:deploy && npm start`
- Attach PostgreSQL plugin and copy connection URLs into `DATABASE_URL` / `DIRECT_URL`.
- Configure persistent environment secrets (JWT/Stripe/API keys).

## VPS (Ubuntu + systemd)
1. Install Node.js 20+ and PostgreSQL client tools.
2. Deploy source to `/opt/onegodian-api`.
3. Run deploy sequence above.
4. Add systemd unit:
   ```ini
   [Unit]
   Description=onegodian-api
   After=network.target

   [Service]
   Type=simple
   WorkingDirectory=/opt/onegodian-api
   EnvironmentFile=/opt/onegodian-api/.env
   ExecStart=/usr/bin/npm start
   Restart=always
   RestartSec=5
   User=www-data

   [Install]
   WantedBy=multi-user.target
   ```
5. Reverse proxy through Nginx/Caddy and enable TLS.

## Docker deployment
Use the included `Dockerfile`:
```bash
docker build -t onegodian-api:prod .
docker run --env-file .env -p 3000:3000 onegodian-api:prod
```

## Seed first admin account
- Generate bcrypt hash for a strong password.
- Set:
  - `SEED_ADMIN_EMAIL`
  - `SEED_ADMIN_NAME`
  - `SEED_ADMIN_PASSWORD_HASH`
- Run `npm run prisma:seed`.

## Rate limiting + request logging review
- Global rate limiter: 100 req / 15 min per IP (`express-rate-limit`).
- Request logging: `pino-http` enabled with environment-aware log levels.
- Recommendation: for very high traffic, move to Redis-backed distributed limiting.

## Verification
- `curl -fsS http://localhost:3000/health`
- `curl -fsS http://localhost:3000/ready`
- `curl -fsS http://localhost:3000/version`

## Rollback
1. Re-deploy the previous image/artifact version.
2. If a schema migration caused impact, apply the latest known-good migration state.
3. Re-run smoke tests and check logs.
