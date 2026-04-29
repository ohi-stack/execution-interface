# onegodian-api

Production Node.js + TypeScript backend for ONEGODIAN, LLC API services.

## Stack
- Express + TypeScript
- Prisma + PostgreSQL
- Helmet, CORS allowlist, compression
- `express-rate-limit` for global throttling
- `pino-http` structured request logging
- JWT auth + role guards

## Quick start
```bash
cp .env.example .env
npm ci
npm run prisma:generate
npm run prisma:migrate:deploy
npm run prisma:seed
npm run check
npm test
npm start
```

## Deployment
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for Render, Railway, VPS, and Docker workflows.
- Use `.env.production.postgres.example` as production env template.

## Health endpoints
- `GET /health`
- `GET /ready`
- `GET /version`
