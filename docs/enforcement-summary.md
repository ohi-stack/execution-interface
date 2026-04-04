# Enforcement Summary

## 1) What was enforced

- Runtime API request validation for create/revoke endpoints.
- Runtime policy evaluation and deny-by-default gating for sensitive API actions.
- Runtime schema validation for policy decisions and audit events.
- Deterministic QR-V V1 verification status outputs.
- CI checks that fail on missing/invalid enforcement artifacts.
- Canonical SQL migration artifact for V1 record and audit constraints.

## 2) Where it is enforced in code

- API routes: `src/routes/api/v1Routes.js`
- API handlers: `src/controllers/api/v1Controller.js`
- Request validation middleware: `src/middleware/validateSchema.js`
- Schema registry and validators: `src/services/schemaRegistry.js`, `src/schemas/enforcementSchemas.js`
- Policy evaluator and enforcement: `src/services/policyService.js`, `governance/policy.yaml`
- Audit event enforcement: `src/services/auditLogService.js`
- V1 status logic and precedence: `src/services/recordStore.js`
- OpenAPI contract: `openapi/openapi.yaml`
- Database enforcement migration: `db/migrations/001_v1_enforcement.sql`
- CI enforcement path: `.github/workflows/ci.yml`, `scripts/validate-enforcement.mjs`

## 3) What now fails automatically

- Invalid create payloads (`POST /api/v1/records`) fail with 400 and structured error.
- Invalid revoke payloads (`POST /api/v1/records/{qrvid}/revoke`) fail with 400 and structured error.
- Unauthorized sensitive actions fail with 403 (`POLICY_DENY`).
- Missing contract artifacts or OpenAPI status enum mismatch fail `npm run validate:enforcement`.
- Broken tests fail CI.

## 4) Remaining gaps

- The SQL migration is added as canonical enforcement spec but is not applied at runtime in this repo because this service currently uses an in-memory store.
- Workflow/task schemas are provided and validated in enforcement tooling, but no ACC workflow engine exists in this repository to attach to runtime processing.

## 5) Exact commands to run checks locally

```bash
npm install
npm run check
npm run validate:enforcement
npm test
```
