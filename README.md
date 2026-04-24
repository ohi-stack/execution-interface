# Onegodian API (Backend Hub)

This repository provides the production backend API for **api.Onegodian.org**.

It is a minimal TypeScript + Express service for ONEGODIAN, LLC, designed for deployment in a standard Node.js hosting environment (including Hostinger).

## What this API does

- Serves system metadata and health endpoints.
- Exposes status and Onegodian definition endpoints.
- Accepts execution requests at `/execute` with safe request validation.
- Returns production-safe JSON errors for unknown routes and server failures.

## Routes

- `GET /` - service metadata
- `GET /health` - health check
- `GET /v1/status` - version + environment + timestamp
- `GET /v1/definition` - Onegodian definition payload
- `POST /execute` - validated execution request

## Prerequisites

- Node.js 20+
- npm 10+

## Local setup

```bash
npm install
cp .env.example .env
```

Then update `.env` with your values.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `APP_NAME` | Yes | Service name returned by metadata endpoints |
| `APP_VERSION` | Yes | Service version returned by status endpoints |
| `NODE_ENV` | No | `development`, `test`, or `production` (defaults to `development`) |
| `PORT` | No | HTTP port (defaults to `3000` for local dev only) |
| `CORS_ORIGINS` | No | Comma-separated allowed origins |
| `TRUST_PROXY` | No | `true` or `false` for reverse proxy trust |

## Build and run

Build:

```bash
npm run build
```

Run compiled app:

```bash
npm start
```

Development watch mode:

```bash
npm run dev
```

## Hostinger deployment steps

1. Push this repository to your deployment source.
2. In Hostinger Node.js settings, set runtime to Node.js 20+.
3. Set environment variables from `.env.example` in Hostinger panel.
4. Install dependencies:
   ```bash
   npm install
   ```
5. Build the application:
   ```bash
   npm run build
   ```
6. Set startup command:
   ```bash
   npm start
   ```
7. Ensure your `api.Onegodian.org` DNS/host mapping points to this Node app.
8. Verify health endpoint after deploy.

## Expected health-check URL

- `https://api.onegodian.org/health`

Expected response shape:

```json
{
  "ok": true,
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Notes

- The server binds to `process.env.PORT` (with local default fallback only).
- CORS allowed origins are configured only via environment variable (`CORS_ORIGINS`).
- Runtime intentionally avoids governance/state-authority claims and remains commercial/private enterprise aligned for ONEGODIAN, LLC.
