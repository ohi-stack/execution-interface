# onegodian-api

Production Node.js + TypeScript backend for **https://api.onegodian.org**.

## Stack

- Express
- Helmet
- CORS allowlist
- Rate limiting
- Pino request logging
- Zod environment validation
- Centralized error handling

## Required environment variables

Copy `.env.example` to `.env` and edit values:

- `NODE_ENV` (`development` | `test` | `production`)
- `PORT` (defaults to `3000` when omitted)
- `CORS_ORIGINS` (comma-separated allowed origins)

## API endpoints

- `GET /`
- `GET /health`
- `GET /api/status`
- `GET /api/version`
- `POST /api/agents/execute` (placeholder)
- `POST /api/twin/execute` (placeholder)
- `POST /api/workflows/run` (placeholder)
- `GET /api/system/capabilities`
- `GET /api/system/registry`

All endpoints return JSON.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

## Production build/start

```bash
npm install
npm run build
npm start
```

The service binds to `process.env.PORT` and falls back to `3000`.

## Deploy to Hostinger (or any Node host)

1. Provision Node.js 20+ on your server.
2. Upload or clone this repository.
3. Enter the API directory:

   ```bash
   cd ohi-stack/onegodian-api
   ```

4. Install, configure, and build:

   ```bash
   npm install
   cp .env.example .env
   # edit .env with production values
   npm run build
   ```

5. Start with a process manager (recommended):

   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name onegodian-api
   pm2 save
   ```

6. Configure reverse proxy + TLS (e.g., Nginx + Certbot) for `api.onegodian.org`.

## CI

GitHub Actions workflow at `.github/workflows/ci.yml` runs:

- `npm ci`
- `npm run check`
- `npm run test`
- `npm run build`
