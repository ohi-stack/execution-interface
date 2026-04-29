# Onegodian / OHI Stack Production Readiness Assessment

## Executive Verdict

- **Current status:** Development / staging architecture
- **Production readiness:** Not yet
- **Reason:** The ecosystem shows strong domain decomposition, but many repositories appear skeletal and are missing standardized production controls.

## Why this matters

Production readiness requires each service to have repeatable build/test/deploy workflows, security controls, health checks, logging, and clear ownership. Repository count alone is not a readiness signal.

## Visible strengths

The portfolio is organized around real platform domains:

- API and control planes
- Registry and verification
- Issuer workflows
- Wallet, SDK, docs, and developer portal
- Billing/admin/status/infrastructure
- Auth/logging/adapters

This is a strong architectural pattern versus a monolithic early-stage repo.

## Core gaps identified

1. **Many repos are very small** (often 1–12 KB), suggesting placeholders/scaffolds.
2. **No enforced baseline standard** across repos for runtime, CI, and deployment assets.
3. **Inconsistent environment discipline** across API and platform services.

## Baseline production standard (recommended per service repo)

- `README.md`
- `.env.example`
- `SECURITY.md`
- `DEPLOYMENT.md`
- `CHANGELOG.md`
- `Dockerfile`
- `docker-compose.yml` (where useful)
- `.github/workflows/ci.yml`
- Entry point (`src` or equivalent)
- Test suite (`tests`)
- Health endpoints: `GET /health`, `GET /ready`, `GET /version`

## Standard Node scripts (recommended)

```json
{
  "scripts": {
    "dev": "node src/index.js",
    "start": "node src/index.js",
    "check": "npm run lint && npm test",
    "lint": "eslint .",
    "test": "node --test",
    "build": "echo \"No build step configured\"",
    "audit:prod": "npm audit --audit-level=high"
  }
}
```

## Phase plan

### Phase 1 — Revenue + verification core

1. `qrv-registry`
2. `qrv-verify`
3. `issuer-qrv`
4. `qrv-api`
5. `qrv-billing`
6. `onegodian-api`
7. `onegodian-org`

**Goal:** Ship a revenue-capable verification product first.

### Phase 2 — ACC command console

1. `acc`
2. `acc-core`
3. `acc-api`
4. `acc-auth`
5. `acc-logs`
6. `acc-runner`
7. `acc-web`

**Goal:** Establish internal orchestration/control plane after revenue core.

### Phase 3 — Ecosystem expansion

1. `qrv-wallet`
2. `qrv-explorer`
3. `qrv-sdk`
4. `qrv-docs`
5. `qrv-developer-portal`

**Goal:** Developer and partner adoption.

## Cashflow-first product framing

Prioritize a **QR-V Paid Verification System** with:

- Free public verification
- Paid issuer dashboard
- Paid record creation
- Paid downloadable verification certificate
- Tiered business/API packages

## Final conclusion

The ecosystem is architecturally promising but not yet production-ready end-to-end. The immediate next step is hardening the smallest revenue-producing slice:

`qrv-registry → issuer-qrv → qrv-verify → qrv-billing → public product page`

