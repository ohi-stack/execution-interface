# Enforcement Implementation Notes

## Repo role (ground truth)

This repository is a **shared verification interface / edge API** for QR-V verification results, implemented as a Node.js + Express service. It is not the canonical `qrv-registry`, `issuer-qrv`, `qrv-node`, or ACC orchestration runtime.

## Existing stack detected

- Runtime: Node.js (ESM)
- Web framework: Express 4
- Package manager: npm
- Existing checks: `npm run check` (`node --check` syntax validation)
- Existing CI: none detected before this change
- Existing persistence/migrations: none detected before this change
- Existing schema/runtime contract validation: none detected before this change

## Gaps found

- No machine-enforced OpenAPI contract.
- No runtime request validation for create/revoke style operations.
- No policy gate for sensitive actions.
- No deterministic V1 status API with exact allowed statuses.
- No canonical migration artifact for V1 enforcement shape.
- No CI workflow to fail on schema/contract/test violations.

## Enforcement layers implemented in this repo

1. **API contract enforcement**
   - Added `openapi/openapi.yaml` for `/api/v1/records`, `/api/v1/verify/{qrvid}`, `/api/v1/records/{qrvid}/revoke`.
   - Added runtime JSON-schema-aligned validation middleware for request enforcement.

2. **V1 verification path support and deterministic status logic**
   - Added runtime in-memory V1 record/revoke/verify API.
   - Enforced exact statuses: `VERIFIED`, `REVOKED`, `EXPIRED`, `NOT_FOUND`.
   - Enforced precedence: `REVOKED` over expiry, `EXPIRED` when past `expires_at_utc`, else `VERIFIED`, else `NOT_FOUND`.

3. **Policy enforcement**
   - Added `governance/policy.yaml` with default-deny posture.
   - Added executable policy evaluator and middleware gating create/revoke actions.

4. **Workflow/task/policy/audit schemas**
   - Added canonical schema artifacts under `schemas/`.
   - Enforced policy decision and audit event schema validation at runtime.

5. **Database schema enforcement artifact**
   - Added `db/migrations/001_v1_enforcement.sql` defining record uniqueness, revocation consistency, UTC timestamps, and audit table constraints.

6. **CI enforcement**
   - Added GitHub Actions CI to run install, syntax checks, enforcement validation, and tests.

