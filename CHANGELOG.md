# Changelog

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

