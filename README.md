# QR-V Issuer Portal Backend

A production-oriented QR-V issuer system built around an **Express API**, an optional **Next.js** issuer UI, and **PostgreSQL/Supabase** persistence. It can still run in a combined process for local development, but the recommended deployment topology is split-domain:

- **issuer.qrv.network** -> Next.js issuer UI
- **api.qrv.network** -> Express API (`server.js`)

For local development, the same codebase can still run in:

- **API + UI mode** when the Next.js app is installed and enabled.
- **API-only mode** when you want a hardened backend process or when the UI dependencies are unavailable.

This rebuild focuses on the runtime wiring that was previously broken: explicit route modules, restored verification endpoints, health/readiness checks, and startup behavior that no longer depends on the frontend booting successfully.

## Core capabilities

- Issuer authentication with signed, HTTP-only session cookies.
- Record issuance via `POST /api/create` using QRVID-1 compact IDs like `QRV-CERT-20260318A84F`.
- Public verification via `POST /api/verify` and `GET /verify/:qrvid`.
- Record revocation via `POST /api/revoke`.
- Authenticated record listing via `GET /api/records`.
- SHA-256 + HMAC integrity envelope for every issued record, including compact and protocol QRVID forms.
- PostgreSQL/Supabase schema bootstrap on startup.
- Liveness and readiness endpoints for deployment health checks.

## Runtime architecture

```text
Express server
├── /health
├── /health/live
├── /ping
├── /health/ready
├── /health/db
├── /api/auth/*
├── /api/records
├── /api/create
├── /api/verify
├── /api/revoke
└── /verify/:qrvid

Optional:
└── Next.js UI handler for dashboard/login pages
```

## Project structure

```text
app/                  # optional Next.js UI
controllers/
  authController.js
  issuerController.js
  verifyController.js
routes/
  auth.js
  issuer.js
  records.js
  verify.js
services/
  authService.js
  databaseService.js
  registryService.js
middleware/
  auth.js
utils/
  crypto.js
  http.js
  idGenerator.js
  api.js
scripts/
  init-db.js
server.js
```

## Environment variables

Copy `.env.example` to `.env` and fill in the values:

```env
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
ENABLE_NEXT_UI=true
APP_BASE_URL=http://localhost:3000
ISSUER_UI_ORIGIN=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
PUBLIC_VERIFY_BASE_URL=http://localhost:3000/verify
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.efcvziegcqccatnkmwtp.supabase.co:5432/postgres
DATABASE_SSL_ENABLED=false
DATABASE_SSL_REJECT_UNAUTHORIZED=false
ISSUER_ID=issuer-demo
ISSUER_NAME=QRV Demo Issuer
ISSUER_EMAIL=issuer@qrv.network
ISSUER_PASSWORD=change-me-now
ISSUER_SESSION_SECRET=replace-with-a-long-random-secret
ISSUER_SIGNING_SECRET=replace-with-a-second-long-random-secret
```

### Notes

- Set `ENABLE_NEXT_UI=false` to run a backend-only process.
- For split deployment, point `issuer.qrv.network` at the Next.js UI and `api.qrv.network` at the Express API, then set `ISSUER_UI_ORIGIN` and `NEXT_PUBLIC_API_BASE_URL` accordingly.
- For Supabase, use only the project Postgres connection string in `DATABASE_URL`. Keep database access on the server via `pg`; do not add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, or `SUPABASE_SERVICE_KEY` for this backend architecture.
- The backend starts without a database, but issuance/verification routes return `503` until `DATABASE_URL` is configured.

## Install and run

```bash
npm config set registry https://registry.npmjs.org/
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Start the backend

API + UI development mode:

```bash
npm run dev
```

API-only mode:

```bash
ENABLE_NEXT_UI=false node server.js
```

Production mode:

```bash
NODE_ENV=production node server.js
```

## API reference

### `POST /api/auth/login`
Authenticate the issuer and set the session cookie.

### `POST /api/auth/logout`
Destroy the current issuer session.

### `GET /api/auth/session`
Read the current issuer session.

### `GET /api/records`
Return the most recent issued records. Requires issuer authentication.

### `POST /api/create`
Create and sign a new record. Requires issuer authentication.

Example body:

```json
{
  "recordType": "certificate",
  "assetName": "Issuer Portal MVP",
  "recipientName": "Ada Lovelace",
  "description": "Completed the issuer.qrv.network pilot.",
  "metadata": {
    "program": "MVP"
  }
}
```

### `POST /api/verify`
Verify a QRVID and return `VERIFIED`, `REVOKED`, `INVALID`, or `NOT_FOUND`. Compact `QRV-CERT-*` and protocol `QRV://registry/type/objectId` forms are both accepted.

```json
{
  "qrvid": "QRV-CERT-20260318A84F"
}
```

### `GET /verify/:qrvid`
Public verification endpoint suitable for QR destinations.

### `POST /api/revoke`
Revoke an existing record. Requires issuer authentication.

```json
{
  "qrvid": "QRV-CERT-20260318A84F",
  "reason": "Issued in error"
}
```

## Health checks

### `GET /health`
Overall status. Returns `200` when the API and database are ready; returns `503` when the API is up but the database is not configured or unreachable.

### `GET /health/live`
Liveness probe. Returns `200` when the process is serving requests.

### `GET /health/ready`
Readiness probe. Returns `200` only when the database is configured and reachable.

### `GET /health/db`
Direct database connectivity probe. Returns `200` with `{ "status": "ok", "db_time": ... }` when `SELECT NOW()` succeeds, and `500` with `{ "status": "error", "message": ... }` when the database connection fails.

### `GET /ping`
Deployment smoke-test route. Returns plain text `pong` without touching the database, which helps distinguish a stale deployment from a real database outage.

## Deployment notes

### Local verification smoke test

Start the server and open:

```text
http://localhost:3000/verify/QRV-CERT-ABC123
```

Expected response before issuing a record:

```json
{
  "success": false,
  "status": "NOT_FOUND"
}
```

### Reverse proxy example

If `verify.qrv.network` should terminate at this Node process, proxy it to the backend port:

```nginx
location / {
  proxy_pass http://localhost:3000;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

## QRVID-1 standard

Issued records now carry:

- compact public QRVID: `QRV-{TYPECODE}-{OBJECTID}`
- canonical protocol QRVID: `QRV://{registry}/{type}/{objectId}`
- verification URL: `https://verify.qrv.network/{compactQrvid}` or the configured local equivalent

The compact validation regex is:

```text
^QRV-[A-Z]+-(?:[A-Z0-9]+-)?[A-Z0-9]{6,32}$
```

## Development checks

```bash
npm run check
npm run db:init
npm run build
```

- `npm run check` validates syntax for the server, routes, controllers, and registry service.
- `npm run db:init` requires a working `DATABASE_URL`.
- `npm run build` requires the Next.js dependencies when UI mode is enabled.
