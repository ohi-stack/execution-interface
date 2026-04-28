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
