# QR-V Certificate Verification System v1 (Pilot Runbook)

## Canonical pilot record

- **QRVID:** `QRV-PROD-CERT-000001`
- **Record Type:** `certificate`
- **Issuer:** `ONEGODIAN, LLC`
- **Subject:** `QR-V Genesis Verification Certificate`
- **Status:** `VERIFIED`
- **Issued Date:** `2026-04-24`
- **Verification URL:** `https://verify.qrv.network/QRV-PROD-CERT-000001`

## Deterministic verification states

- `VERIFIED`
- `REVOKED`
- `EXPIRED`
- `NOT_FOUND`
- `INVALID_FORMAT`
- `INVALID_SIGNATURE`
- `UNAVAILABLE`

## Environment variables

Required:

- `DATABASE_URL`
- `QRV_SIGNING_SECRET`
- `QRV_ISSUER_KEYS` (example: `onegodian-llc:prod-secret-key`)
- `CORS_ORIGINS` (comma-separated allowlist)

Optional:

- `PORT` (default `3000`)
- `NODE_ENV` (`production` in deploy)

## Migration command

```bash
psql "$DATABASE_URL" -f db/migrations/001_v1_enforcement.sql
psql "$DATABASE_URL" -f db/migrations/002_qrv_certificate_v1.sql
```

## Seed command

```bash
node scripts/qrv-pilot-seed.mjs
```

On success, script prints:

```text
Verification URL: https://verify.qrv.network/QRV-PROD-CERT-000001
```

## API routes to validate

- `GET /healthz`
- `GET /readyz`
- `GET /version`
- `GET /api/v1/verify/:qrvid`
- `POST /registry/create`
- `POST /api/v1/revoke/:qrvid`

## cURL tests

Create record:

```bash
curl -X POST http://localhost:3000/registry/create \
  -H 'content-type: application/json' \
  -H 'x-actor-role: issuer' \
  -H 'x-issuer-id: onegodian-llc' \
  -H 'x-issuer-key: prod-secret-key' \
  -d '{
    "qrvid":"QRV-PROD-CERT-000001",
    "recipient":"ONEGODIAN, LLC",
    "subject":"QR-V Genesis Verification Certificate",
    "title":"QR-V Genesis Verification Certificate",
    "description":"Pilot genesis certificate used for QR-V production activation.",
    "issuer":"onegodian-llc",
    "issueDate":"2026-04-24T00:00:00Z"
  }'
```

Verify record:

```bash
curl http://localhost:3000/api/v1/verify/QRV-PROD-CERT-000001
```

Revoke record:

```bash
curl -X POST http://localhost:3000/api/v1/revoke/QRV-PROD-CERT-000001 \
  -H 'content-type: application/json' \
  -H 'x-actor-role: admin' \
  -H 'x-issuer-id: onegodian-llc' \
  -H 'x-issuer-key: prod-secret-key' \
  -d '{"revoked_at_utc":"2026-04-25T00:00:00Z","reason":"pilot revocation test"}'
```

Expected verify JSON (VERIFIED sample):

```json
{
  "qrvid": "QRV-PROD-CERT-000001",
  "verificationState": "VERIFIED",
  "recordType": "CERTIFICATE",
  "issuer": "onegodian-llc",
  "status": "VERIFIED",
  "issuedAt": "2026-04-24T00:00:00Z",
  "expiresAt": null,
  "hash": "<truncated>",
  "signatureValid": true,
  "canonicalUrl": "https://verify.qrv.network/QRV-PROD-CERT-000001",
  "apiUrl": "https://api.qrv.network/api/v1/verify/QRV-PROD-CERT-000001",
  "source": "qrv-registry"
}
```

## Hostinger deployment notes

- Point `verify.qrv.network` to the portal app.
- Point `api.qrv.network` to this API service deployment.
- Set `NODE_ENV=production` and all required env vars in Hostinger panel.
- Set `CORS_ORIGINS` explicitly (no wildcard).
- Confirm `/healthz`, `/readyz`, `/version` before cutover.

## Production checklist

- [ ] Migration files applied successfully.
- [ ] Canonical pilot record seeded.
- [ ] `GET /api/v1/verify/QRV-PROD-CERT-000001` returns `VERIFIED`.
- [ ] Issuer auth required for create and revoke.
- [ ] Verify route is public + rate-limited.
- [ ] Hash/signature values are truncated in public response.
- [ ] `verify.qrv.network/QRV-PROD-CERT-000001` resolves correctly.
