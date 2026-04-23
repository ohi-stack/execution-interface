# onegodian-api

Standalone backend API for **api.onegodian.org** built with TypeScript + Express.

This repository is intentionally backend-only. It does not assume Next.js, frontend commerce pages, or verify-portal runtime behavior.

## Runtime Baseline

- Node.js `20.x`
- npm `10+`
- TypeScript build output in `dist/`

## Endpoints

- `GET /`
- `GET /health`
- `GET /ready`
- `GET /v1/status`
- `GET /v1/definition`
- `POST /execute`

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Variables:

```env
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://app.onegodian.org
LOG_LEVEL=info
JSON_BODY_LIMIT=1mb
```

- `CORS_ORIGIN` accepts a comma-separated allowlist.
- If `LOG_LEVEL=silent`, request logging is disabled.

## Install

```bash
npm install
```

## Local Development

```bash
npm run dev
```

## Type Check

```bash
npm run typecheck
```

## Build

```bash
npm run build
```

## Start (Production)

```bash
npm start
```

Startup runs the compiled file: `node dist/index.js`.

## `/execute` Request Contract

### Valid request

```json
{
  "task": "Run daily sync",
  "agent": "scheduler",
  "metadata": { "source": "manual" }
}
```

### Validation rules

- Body must be a JSON object.
- `task` is required and must be a non-empty string.

### Error behavior

- Invalid JSON returns HTTP `400` with structured error JSON.
- Missing/invalid `task` returns HTTP `400` with structured error JSON.

## Hostinger Deployment (Node Hosting)

Use this exact flow for V1 deployment.

1. In Hostinger hPanel, open **Websites → Manage → Advanced → Node.js**.
2. Create/update Node app with:
   - **Node version:** `20.x`
   - **App root:** your uploaded repo folder
   - **Startup command:** `npm start`
3. Upload repository files to app root (Git/SFTP/File Manager).
4. Open terminal in app root and run:

```bash
npm install
npm run build
```

5. Configure environment variables in Node app settings:
   - `NODE_ENV=production`
   - `PORT` (use Hostinger-provided port if applicable)
   - `CORS_ORIGIN=https://your-allowed-origin.com`
   - `LOG_LEVEL=info`
   - `JSON_BODY_LIMIT=1mb`
6. Start or restart app from hPanel (or run `npm start`).
7. Verify health checks:
   - `https://api.onegodian.org/health`
   - `https://api.onegodian.org/ready`

Expected result: both URLs return HTTP `200` JSON.

## Production Behavior Included

- `helmet` security headers
- `cors` with env-driven allowlist
- `morgan` request logging
- JSON body size limit
- centralized `404` handler
- centralized error handler
- graceful shutdown for `SIGINT` / `SIGTERM`
