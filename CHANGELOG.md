# Changelog

## v1.0.0-rc1 - 2026-04-24

### Added
- PostgreSQL runtime persistence adapter for QR-V records.
- Issuer admin provisioning endpoints (create issuer, rotate key, suspend issuer).
- `/metrics` endpoint with launch KPIs.
- Canonical pilot seed script for `QRV-PROD-CERT-000001`.
- Verification and registry operational endpoints (`/healthz`, `/readyz`, `/version`, `/registry/create`).

### Changed
- Record store now uses PostgreSQL when `DATABASE_URL` is set; in-memory fallback remains for local dev only.
- Verification audits now capture VERIFY / FAILED_VERIFY events and latency details.

### Security
- Issuer auth enforced for create/revoke.
- Admin API key enforcement for issuer provisioning actions.
- CORS allowlist validation and verification route throttling.

### Notes
- RC1 is functionally launch-candidate for pilot traffic pending final infrastructure validation.
