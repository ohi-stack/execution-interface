# OneGodian Verify Portal

`onegodian-verify-portal` is the public verification resolution interface for the OneGodian ecosystem and the QR-V™ Global Verification Network. It is designed to run at `https://verify.qrv.network` and resolve QRVID lookups against `https://api.qrv.network`.

## What this service does

- Resolves QRVIDs from direct URLs or manual input.
- Calls the upstream verification API (`GET /verify/:qrvid`).
- Renders deterministic states (`VERIFIED`, `REVOKED`, `EXPIRED`, `NOT_FOUND`, `INVALID_FORMAT`, `INVALID_SIGNATURE`, `UNAVAILABLE`).
- Exposes governance APIs under `/api/omos` and verification core APIs under `/api/v1`.
- Provides operational health and architecture views.

## Routes

### Auth/System
- `GET /health`
- `GET /healthz`
- `GET /readyz`
- `GET /version`

### API/Core
- `POST /registry/create`
- `POST /api/v1/records`
- `GET /api/v1/verify/:qrvid`
- `POST /api/v1/revoke/:qrvid`
- `POST /api/v1/records/:qrvid/revoke`
- `GET /api/omos/identity-definition`
- `POST /api/omos/classify`
- `POST /api/omos/align`
- `POST /api/omos/timestamp/convert`
- `POST /api/omos/decision/run`

### Pages/UI
- `GET /`
- `GET /system-architecture`
- `POST /verify`
- `GET /verify/:qrvid`
- `GET /:qrvid`

## Quickstart

### Requirements
- Node.js 20+
- npm 10+

### Setup
```bash
npm install
cp .env.example .env
```

### Run
```bash
npm run build
npm start
```
Open `http://localhost:3000`.

## Environment variables

Use `.env.example` as your baseline:

```env
PORT=3000
NEXT_PUBLIC_API_URL=https://api.qrv.network
API_BASE_URL=https://api.qrv.network
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000
EXECUTE_API_KEY=replace_with_random_secret
```

## Quality gates

```bash
npm run lint
npm run typecheck
npm test
npm run test:root
npm run build
npm run check
node scripts/validate-production-env.mjs
node scripts/detect-config-conflicts.mjs
node scripts/production-smoke-check.mjs
```

## Deployment

### Standard Node runtime
1. Build the app with `npm run build`.
2. Install production deps with `npm install --omit=dev`.
3. Set `NODE_ENV=production` and API URL env vars.
4. Start using `npm start`.
5. Verify `GET /health`.

### Docker
```bash
docker build -t onegodian-verify-portal .
docker run --rm -p 3000:3000 --env-file .env onegodian-verify-portal
```

## Troubleshooting

- **`npm run build` fails with missing type declarations**: run `npm install` to ensure dev dependencies are present.
- **`/verify/:qrvid` shows unavailable**: validate outbound network access and `NEXT_PUBLIC_API_URL`.
- **Invalid identifier errors**: ensure values follow `QRV-123456789` format.
- **Port collision**: set `PORT` to an open port.

## Security notes

- Input is sanitized server-side before outbound requests.
- No direct database access is exposed in this service.
- Unavailable upstream responses render deterministic safe defaults.


- Execution endpoint (`POST /execute`) requires `x-api-key` matching `EXECUTE_API_KEY`.
- Configure `CORS_ORIGINS` in production to a comma-separated allowlist.


## QR-V pilot activation commands

Migration:
```bash
psql "$DATABASE_URL" -f db/migrations/001_v1_enforcement.sql
psql "$DATABASE_URL" -f db/migrations/002_qrv_certificate_v1.sql
```

Seed canonical pilot record:
```bash
node scripts/qrv-pilot-seed.mjs
```

Verify canonical pilot record:
```bash
curl http://localhost:3000/api/v1/verify/QRV-PROD-CERT-000001
```

See full pilot runbook: `docs/qrv-certificate-pilot-v1.md`.


## Hostinger production notes

- Ensure URL env vars contain no whitespace or newlines.
- Use comma-separated `CORS_ORIGINS` including all trusted origins.
- If `issuer.qrv.network` returns `Cannot GET /login%0A...`, verify routing/proxy rules and URL encoding in redirect settings.


## Env precedence / conflict handling

- API base URL precedence: `NEXT_PUBLIC_API_URL` -> `API_BASE_URL` -> `QRV_API_BASE_URL`.
- CORS precedence: `CORS_ORIGINS` -> `CORS_ORIGIN` -> `ALLOWED_ORIGINS`.
- Run `npm run detect:config-conflicts` before deploy to catch conflicting values.


## GitHub merge conflict helper

If GitHub shows "This branch has conflicts", use:

```bash
./scripts/resolve-github-conflicts.sh main
```

Reference: `docs/github-conflict-resolution.md`.
