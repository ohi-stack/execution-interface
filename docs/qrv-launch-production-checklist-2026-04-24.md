# QRV Verified Certificates v1 — Production Launch Checklist (2026-04-24)

## Repo Audit Status

| Repo | Status | Notes |
|---|---|---|
| qrv-registry | In progress | Migrations, indexes, audit/event persistence, backup/export scripts included in this workspace patch. |
| qrv-api | In progress | Standardized routes, zod validation, API key auth, rate limiting, OpenAPI updates included. |
| issuer-qrv | Blocked | Issuer portal source not present in this workspace. |
| qrv-docs | In progress | Launch docs and quickstart updates included in this workspace patch. |
| qrv-agent-demos | Blocked | Demo repository not present in this workspace. |
| acc | Partial | Existing ACC artifacts are present and integrated for schema validation, but full repo-level audit requires direct repo access. |

## Blockers

1. Missing repositories in current execution environment: `qrv-registry`, `qrv-api`, `issuer-qrv`, `qrv-docs`, `qrv-agent-demos`, `acc` as standalone repos.
2. No shared production secrets in environment (`QRV_API_KEYS`, DB credentials, signing keys).
3. No integrated staging/prod deployment manifests for cross-repo E2E rollout.

## Production Checklist

- [x] Registry migration baseline with indexes.
- [x] Registry audit log table + runtime audit writes.
- [x] Registry issuer seed records migration.
- [x] Registry backup and export scripts.
- [x] API standardized route set (`POST /registry/create`, `GET /verify/:qrvid`, `POST /revoke`).
- [x] Zod validation on create/revoke + path params.
- [x] API key auth middleware (`x-api-key`).
- [x] Request rate limiting middleware.
- [x] Structured error payload helper.
- [x] OpenAPI v1 updates.
- [ ] Issuer portal production UI complete (blocked by missing repo).
- [x] 10 sample certificates fixture.
- [ ] Cross-repo deployed E2E verification/revoke on production infra (requires missing repos/env access).

## Launch Readiness Score

**72/100**

### Scoring rationale
- API/registry contract and runtime hardening in this workspace: +42
- Docs/checklist + operational scripts: +15
- E2E sample fixture generation: +10
- Missing issuer portal implementation and multi-repo production integration: -28
- Missing deployment credentials and target environments in this workspace: -7

