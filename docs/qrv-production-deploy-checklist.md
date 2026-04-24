# QR-V Production Deploy Checklist

## api.qrv.network
- [ ] Deploy API service build.
- [ ] Set env: `NODE_ENV=production`, `DATABASE_URL`, `QRV_SIGNING_SECRET`, `QRV_ISSUER_KEYS`, `ADMIN_API_KEY`, `CORS_ORIGINS`.
- [ ] Validate `GET /healthz`, `GET /readyz`, `GET /version`, `GET /metrics`.
- [ ] Validate `GET /api/v1/verify/QRV-PROD-CERT-000001`.

## verify.qrv.network
- [ ] Point domain to verification portal app.
- [ ] Ensure `NEXT_PUBLIC_API_URL=https://api.qrv.network/api/v1`.
- [ ] Confirm public URL resolution `GET /QRV-PROD-CERT-000001`.

## issuer.qrv.network
- [ ] Keep issuer UI isolated from API node.
- [ ] Configure issuer workflows to call `POST /registry/create` and `POST /api/v1/revoke/:qrvid`.
- [ ] Validate issuer API keys are provisioned and rotated.

## registry.qrv.network
- [ ] Apply migrations `001_v1_enforcement.sql` and `002_qrv_certificate_v1.sql`.
- [ ] Seed canonical pilot record.
- [ ] Restrict DB network ingress and enable backups.

## Final go-live checks
- [ ] Lifecycle test passes: create -> verify -> revoke -> restart -> verify revoked.
- [ ] Metrics populate in production.
- [ ] Audit logs include CREATE / VERIFY / REVOKE / FAILED_VERIFY.
- [ ] Incident rollback plan documented.
