# Deployment Guide

## Local run
1. Copy `.env.example` to `.env` and fill required secrets.
2. Install dependencies: `npm install`.
3. Validate code: `npm run check`.
4. Run tests: `npm test`.
5. Start API: `npm start`.

## Environment variables
- `NODE_ENV`, `PORT`, `APP_NAME`, `APP_URL`
- `DATABASE_URL`, `DIRECT_URL`
- `JWT_SECRET`, `API_KEY`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `CORS_ORIGIN`, `LOG_LEVEL`

## Production deployment
1. Build artifact: `npm run build`.
2. Configure production `.env` via secret manager.
3. Run schema migrations: `npm run prisma:migrate:deploy`.
4. Start service: `npm start`.
5. Verify `/health`, `/ready`, `/version`.

## Rollback
1. Re-deploy the previous image/artifact version.
2. If a schema migration caused impact, apply the latest known-good migration state.
3. Re-run smoke tests and check logs.

## Smoke tests
- `curl -fsS http://localhost:3000/health`
- `curl -fsS http://localhost:3000/ready`
- `curl -fsS http://localhost:3000/version`
