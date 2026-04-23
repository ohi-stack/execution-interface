# Repo Boundary Report (Onegodian vs ACC)

Audit date: 2026-04-22 (UTC)

## Scope
This workspace only contains `execution-interface`. Canonical repositories (`onegodian-org`, `onegodian-api`, `onegodian-llm`, `acc-api`, `acc-core`, `acc-runner`) are not present locally.

The report below classifies current code by target repository and flags mixed concerns.

---

## 1) What belongs in `onegodian-org`

**Purpose**: public/institutional web content and governance-facing documentation for ONEGODIAN, LLC commercial/IP positioning.

### Move targets from current repo
- `src/views/onegodian/components.js` -> `onegodian-org/src/views/components.js`
- `src/views/onegodian/layout.js` -> `onegodian-org/src/views/layout.js`
- `src/views/onegodian/pages.js` -> `onegodian-org/src/views/pages.js`
- `src/controllers/onegodianSiteController.js` -> `onegodian-org/src/controllers/siteController.js`
- `src/routes/onegodianSiteRoutes.js` -> `onegodian-org/src/routes/siteRoutes.js`

### Org docs that should live in `onegodian-org`
- `docs/implementation-status.md` -> `onegodian-org/docs/implementation-status.md`
- `docs/service-boundary.md` -> `onegodian-org/docs/service-boundary.md`
- `docs/onegodian-gap-report.md` -> `onegodian-org/docs/onegodian-gap-report.md`

---

## 2) What belongs in `onegodian-api`

**Purpose**: commercial product APIs, checkout, payment webhook handling, order/download services, and shared date/time utilities tied to product logic.

### Move targets from current repo
- `src/controllers/onegodianApiController.js` -> `onegodian-api/src/controllers/productsController.js`
- `src/routes/onegodianApiRoutes.js` -> `onegodian-api/src/routes/productsRoutes.js`
- `src/services/onegodianCommerceService.js` -> `onegodian-api/src/services/commerceService.js`
- `src/utils/otsDate.js` -> `onegodian-api/src/utils/otsDate.js`
- `test/onegodian-foundation.test.js` ->
  - `onegodian-api/test/commerce-and-ots.test.js` (API/OTS subset)
  - `onegodian-org/test/site-routes.test.js` (site subset)

### Environment templates
- `environment.example` -> `onegodian-api/environment.example`
- Onegodian-specific variables in `.env.example` should be moved to onegodian repos and removed from unrelated services.

---

## 3) What belongs in `acc-api` / `acc-core` / `acc-runner`

**Purpose**: ACC control plane only (agents, tasks, workflows, authorization, runtime governance).

### Should stay in ACC repos (not in Onegodian API/org runtime)
- Task/workflow/policy/audit control-plane contracts and runtime endpoints.
- Agent/task orchestration execution, workflow scheduling, and governance enforcement.

### Current repository files with ACC-shaped concerns
These files are acceptable only if this repo is acting as a temporary adapter surface; otherwise they should be moved to ACC repos:
- `src/schemas/enforcementSchemas.js` (task/workflow/policy/audit schema definitions)
- `src/services/schemaRegistry.js` (schema registry includes task/workflow validators)

Recommended destinations:
- `src/schemas/enforcementSchemas.js` -> `acc-api/schemas/enforcementSchemas.js`
- `src/services/schemaRegistry.js` -> `acc-core/services/schemaRegistry.js`

---

## 4) Mixed-concern flags

### Flag A: Mixed business domains in one runtime
`execution-interface` currently mixes:
- QR-V verification portal runtime,
- Onegodian commercial/org runtime,
- ACC-shaped enforcement schema utilities.

**Risk**: unclear ownership boundaries, coupling in routing/env/config, and drift from canonical repo topology.

### Flag B: Onegodian pages + APIs in same process
In canonical layout these should be split (`onegodian-org` vs `onegodian-api`) even if deployed behind same gateway.

### Flag C: Shared env file pollution
`.env.example` now includes both QR-V and Onegodian variables. This should be separated by repo/runtime.

---

## 5) Exact file moves (actionable)

1. Create repos:
   - `onegodian-org`
   - `onegodian-api`
   - `onegodian-llm`
2. Move site stack:
   - `src/views/onegodian/*` -> `onegodian-org/src/views/*`
   - `src/controllers/onegodianSiteController.js` -> `onegodian-org/src/controllers/siteController.js`
   - `src/routes/onegodianSiteRoutes.js` -> `onegodian-org/src/routes/siteRoutes.js`
3. Move API stack:
   - `src/controllers/onegodianApiController.js` -> `onegodian-api/src/controllers/productsController.js`
   - `src/routes/onegodianApiRoutes.js` -> `onegodian-api/src/routes/productsRoutes.js`
   - `src/services/onegodianCommerceService.js` -> `onegodian-api/src/services/commerceService.js`
   - `src/utils/otsDate.js` -> `onegodian-api/src/utils/otsDate.js`
4. Move LLM reference modules:
   - `src/llm/onegodianReferences.js` -> `onegodian-llm/src/references.js`
   - `src/llm/onegodianPromptService.js` -> `onegodian-llm/src/promptService.js`
   - `src/llm/config.js` -> `onegodian-llm/src/config.js`
5. Isolate ACC concerns behind adapters until moved:
   - Add adapter namespace in this repo if temporary interop is required.
   - Move `src/schemas/enforcementSchemas.js` and `src/services/schemaRegistry.js` into ACC repos as above.

---

## 6) Boundary-preserving rule set (enforcement)

- `onegodian-api`: products, checkout, webhooks, secure downloads, OTS utilities, Onegodian LLM reference modules.
- `onegodian-org`: public/institutional pages and governance documentation.
- `acc-api`/`acc-core`/`acc-runner`: agents/tasks/workflows/auth/runtime governance only.
- No direct mixing of ACC task/workflow runtimes into Onegodian public/commercial API services except through explicit adapters.
