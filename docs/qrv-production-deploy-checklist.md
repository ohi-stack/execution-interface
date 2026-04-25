# QRV Production Deploy Checklist

## Deployment order
1. Apply DB migrations (`001_v1_enforcement.sql`, `002_qrv_v1_registry.sql`).
2. Deploy API (`api.qrv.network`) and verify `/healthz`, `/readyz`, `/version`, `/metrics`.
3. Validate production env (`npm run validate:prod`).
4. Deploy issuer frontend (`issuer.qrv.network`) with onboarding + billing screens.
5. Deploy verify frontend (`verify.qrv.network`) and confirm public scan status rendering.

## Required production env
- `NODE_ENV=production`
- `DATABASE_URL`
- `QRV_API_KEYS`
- `QRV_SIGNING_SECRET`
- `QRV_JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_GROWTH`
- `STRIPE_PRICE_PRO`
- `SERVICE_NAME`
- Backup variable: `QRV_BACKUP_DIR` or `QRV_BACKUP_SCHEDULE`

## Launch smoke criteria
- New issuer can register and verify email.
- Issuer can start Stripe checkout for selected plan.
- Subscription status visible in issuer dashboard API (`/api/v1/billing/:issuer_id/status`).
- Issuer can issue certificate and public verify returns `VERIFIED`.
- Revocation flow updates status to `REVOKED`.
- Public verify page renders issuer logo, recipient, certificate title, issue date, timestamp, and proof reference.
