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
All notable changes to this repository are documented here.

## [1.0.0-rc.1] - 2026-04-24

### Added
- Production readiness audit artifact and launch checklist for QR-V nodes.
- API contract hardening with Zod validation, API key protection, and rate limiting for write/read endpoints.
- Registry operations scripts for backup/export and migration artifacts for enforcement + registry hardening.
- CI baseline verification workflow for install, checks, enforcement validation, and tests.

### Changed
- Verification and revoke route handling aligned to explicit v1 registry API shape.
- OpenAPI contract and readiness docs updated for v1 launch preparation.

### Merged PRs
- #56 — Audit and improve QRV repositories for launch.
- #55 — Conduct production readiness audit.
- #52 — Perform production readiness audit.
- #51 — Prepare production v1.0 release for plugin.
- #50 — Create new GitHub repositories for projects.
- #49 — Create architecture for OneGodian LMS plugin.
- #48 — Prepare app for live deployment.
- #46 — Build OneGodian identity engine platform.
- #45 — Implement schema validation with AJV or Zod.
- #44 — Automate repo stabilization and cleanup.

## [0.1.0] - 2026-03-19

### Merged PRs
- #6 — Create production-ready QR-V verification portal.

