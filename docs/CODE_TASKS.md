# OMOS Runtime Production Task Queue

Repository: `ohi-stack/omos-site`  
Scope: Production-grade OMOS runtime delivery.

## Operational Rules (Locked)

1. Only one consensus counter is allowed across runtime execution state.
2. Test artifacts must be excluded from production-facing registries.
3. Commercial separation between OMOS and OneGodian.com is mandatory.
4. WordPress plugin synchronization must follow the defined plugin sync architecture.
5. UTC-first timestamping is required for all persisted and transmitted temporal records.
6. All deployable features must meet production validation standards before release.

## Task Queue

### TASK-001 — Runtime API Baseline
- **Priority:** P0
- **Required files:** `server.js`, `src/runtime/api/*`
- **Endpoints:** `/api/system-health`
- **Acceptance criteria:** Health endpoint returns runtime/service status, UTC timestamp, and build metadata.
- **Production rules:** No debug payloads in production responses.

### TASK-002 — Tools Registry API
- **Priority:** P0
- **Required files:** `src/runtime/tools/*`, `server.js`
- **Endpoints:** `/api/tools`
- **Acceptance criteria:** Deterministic list, schema-validated entries, and production filtering.
- **Production rules:** Exclude test/dev tools.

### TASK-003 — Artifacts Registry API
- **Priority:** P0
- **Required files:** `src/runtime/artifacts/*`, `server.js`
- **Endpoints:** `/api/artifacts`
- **Acceptance criteria:** Registry supports category/tag metadata and immutable IDs.
- **Production rules:** Exclude test artifacts.

### TASK-004 — Dashboard API Layer
- **Priority:** P0
- **Required files:** `src/runtime/dashboard/*`, `server.js`
- **Endpoints:** `/api/dashboard`
- **Acceptance criteria:** Unified dashboard payload for runtime metrics and registry summaries.
- **Production rules:** Redact sensitive internals.

### TASK-005 — Manifest Architecture
- **Priority:** P1
- **Required files:** `src/runtime/manifest/*`
- **Endpoints:** N/A (internal schema)
- **Acceptance criteria:** Typed manifest model with versioned compatibility.
- **Production rules:** Backward-compatibility policy enforced.

### TASK-006 — Frontend Runtime Routes
- **Priority:** P1
- **Required files:** `public/*`, `src/routes/*`
- **Endpoints/Pages:**
  - `/ohi`
  - `/models`
  - `/artifacts`
  - `/shop`
  - `/latest-news`
  - `/contact`
  - `/registry`
  - `/verify`
  - `/time`
  - `/foundation`
- **Acceptance criteria:** All routes resolve, hydrate, and pass smoke checks.
- **Production rules:** No broken links or placeholder assets.

### TASK-007 — WordPress Plugin Sync
- **Priority:** P1
- **Required files:** `src/integrations/wordpress/*`
- **Endpoints:** Internal sync webhooks/tasks
- **Acceptance criteria:** Bidirectional content sync with conflict-safe reconciliation.
- **Production rules:** Preserve OMOS/OneGodian commercial separation.

### TASK-008 — Deployment Stack Definition
- **Priority:** P1
- **Required files:** `Dockerfile`, `docker-compose.yml`, deployment manifests
- **Endpoints:** N/A
- **Acceptance criteria:** Reproducible production builds and rollout strategy documented.
- **Production rules:** Immutable image tagging.

### TASK-009 — CI + Smoke Testing
- **Priority:** P0
- **Required files:** `.github/workflows/*`, `tests/smoke.test.js`
- **Endpoints:** Validate `/api/tools`, `/api/artifacts`, `/api/system-health`, `/api/dashboard`
- **Acceptance criteria:** CI gates merge on smoke and lint/test success.
- **Production rules:** Block release on regression.

### TASK-010 — Docker Runtime Setup
- **Priority:** P1
- **Required files:** `Dockerfile`, `.dockerignore`, runtime scripts
- **Endpoints:** N/A
- **Acceptance criteria:** Container starts cleanly and serves runtime + APIs.
- **Production rules:** Non-root runtime user.

### TASK-011 — Compliance API Surface
- **Priority:** P1
- **Required files:** `src/runtime/compliance/*`
- **Endpoints:** Compliance metadata endpoints (internal/public as approved)
- **Acceptance criteria:** Institutional classification and policy checks exposed.
- **Production rules:** Audit-safe logs and traceability.

### TASK-012 — OTS-V5 Runtime Utility
- **Priority:** P1
- **Required files:** `src/runtime/ots-v5/*`
- **Endpoints:** Utility endpoint(s) as required
- **Acceptance criteria:** Deterministic runtime utility behavior and typed outputs.
- **Production rules:** Enforce UTC-first timestamps.

### TASK-013 — Shortcode System
- **Priority:** P2
- **Required files:** `src/runtime/shortcodes/*`, CMS bridge files
- **Endpoints:** N/A
- **Acceptance criteria:** Shortcodes render stable runtime components.
- **Production rules:** Sanitization and XSS-safe output.

### TASK-014 — Artifacts Governance
- **Priority:** P1
- **Required files:** `src/runtime/artifacts/governance/*`
- **Endpoints:** `/api/artifacts`
- **Acceptance criteria:** Policy filters for publication classes.
- **Production rules:** Exclude non-production and test entries.

### TASK-015 — Production Hardening
- **Priority:** P0
- **Required files:** `server.js`, middleware/security configs
- **Endpoints:** Global
- **Acceptance criteria:** Headers, rate limits, input validation, and error sanitation active.
- **Production rules:** Zero sensitive stack traces in production.

### TASK-016 — Runtime Validation Framework
- **Priority:** P0
- **Required files:** `tests/smoke.test.js`, validation utilities
- **Endpoints:** Core runtime + public routes
- **Acceptance criteria:** Automated validation matrix for API/route uptime and schema guarantees.
- **Production rules:** Release blocked on failed validation.

## Current Runtime Baseline Alignment

This queue builds directly on the existing Node runtime and test surface currently represented by:
- `server.js`
- `package.json`
- `tests/smoke.test.js`

It also aligns with institutional/framework references:
- The OneGodian Protocol™ and Algorithm™
- The Onegodian Digital Sanctuary
- OMOS institutional classification guidance
