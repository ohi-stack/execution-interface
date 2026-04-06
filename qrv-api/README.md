# qrv-api

Live issuance and verification API backed by PostgreSQL.

## Required env

- `PORT`
- `DATABASE_URL`
- `VERIFY_BASE_URL`
- `SIGNING_SECRET`
- `ISSUER_NAME`
- `NODE_ENV`

## Endpoints

- `GET /health` returns service status and DB readiness.
- `POST /registry/create` creates live rows in `qr_objects`, `qr_certificates`, and `qr_audit_log`.
- `GET /verify/:qrvid` joins issuer + certificate data and maps statuses to `VERIFIED | REVOKED | EXPIRED | NOT_FOUND`.
- `POST /revoke` revokes a QRVID and writes an audit row.

## Run

```bash
npm install express pg
cp .env.example .env
node server.js
```
