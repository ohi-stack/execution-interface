# QRV v1 PR Consolidation Summary

Clean branch selected for production: this branch (`work`) after consolidating overlapping route, auth, and persistence work into one API contract.

## Duplicate/superseded PR themes to close
1. Legacy `/api/v1/records` + `/api/v1/records/:qrvid/revoke` contracts (superseded by canonical `/registry/create` and `/revoke`).
2. Mock/in-memory-only verification responses without signature checks (superseded by signature-aware status model and Postgres-backed repository support).
3. Separate health-only fragments without `/metrics` and readiness repository checks (superseded by unified operational endpoint set).
4. Non-canonical migration naming (`002_qrv_registry_hardening.sql`) without v1 canonical schema additions (superseded by `002_qrv_v1_registry.sql`).

## Final canonical production scope
- Certificate-first create/verify/revoke.
- Deterministic statuses including `INVALID_SIGNATURE` and `ERROR`.
- API key auth + JWT middleware for issuer/admin provisioning flows.
- Postgres-backed repository support with seed record `QRV-PROD-CERT-000001`.
