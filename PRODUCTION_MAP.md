# PRODUCTION_MAP

## Domain route ownership

### api.qrv.network
- Certificate API:
  - `/api/v1/registry/create`
  - `/api/v1/verify/:qrvid`
  - `/api/v1/revoke`
  - `/api/v1/issuer/certificates`
  - `/api/v1/issuer/certificates/:qrvid/revoke`
- Issuer onboarding API:
  - `/api/v1/onboarding/signup`
  - `/api/v1/onboarding/verify-email`
  - `/api/v1/onboarding/:issuer_id/profile`
  - `/api/v1/onboarding/:issuer_id/api-key`
  - `/api/v1/onboarding/:issuer_id/issue-first-certificate`
- Billing API:
  - `/api/v1/billing/plans`
  - `/api/v1/billing/checkout`
  - `/api/v1/billing/:issuer_id/plan`
  - `/api/v1/billing/:issuer_id/status`
- Admin provisioning API:
  - `/api/v1/admin/issuers`
  - `/api/v1/admin/api-keys`
- Operations:
  - `/healthz`, `/readyz`, `/version`, `/metrics`

### registry.qrv.network
- Proxy to API backend registry/verify routes only:
  - `/api/v1/registry/create`
  - `/api/v1/verify/:qrvid`
  - `/api/v1/revoke`
  - `/healthz`, `/readyz`, `/version`, `/metrics`

### issuer.qrv.network
- Issuer Next.js app routes (existing app):
  - `/signup`
  - `/dashboard`
  - `/billing`
  - `/issue-first-certificate`
- Calls to API endpoints listed under `api.qrv.network` onboarding + billing + issuer certificate APIs.

### verify.qrv.network
- Public verification + founder sales kit pages:
  - `/`
  - `/:qrvid`
  - `/verify/:qrvid`
  - `/pricing`
  - `/book-demo`
  - `/certificate-verification`
  - `/membership-verification`
- Upstream read-only API:
  - `GET /api/v1/verify/:qrvid`

## Required environment variables
- `NODE_ENV`
- `SERVICE_NAME`
- `DATABASE_URL`
- `QRV_API_KEYS`
- `QRV_SIGNING_SECRET`
- `QRV_JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_GROWTH`
- `STRIPE_PRICE_PRO`
- `NEXT_PUBLIC_API_URL`
- `API_BASE_URL`
- `QRV_BACKUP_DIR` or `QRV_BACKUP_SCHEDULE`

## Deployment order
1. Postgres + migrations.
2. API service (`api.qrv.network`).
3. Registry routing (`registry.qrv.network`).
4. Issuer app (`issuer.qrv.network`).
5. Verify app (`verify.qrv.network`).
