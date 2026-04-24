# QuantumOHI Multi-Repository Portfolio Map

This document captures a production-oriented repository architecture for `QuantumOHI.com` using a **WordPress + Node hybrid model**, with clear boundaries between presentation, controlled execution, identity, registry truth, and shared contracts.

## Portfolio repositories

- `quantumohi-com-web`
- `quantumohi-execution-gateway`
- `quantumohi-identity-service`
- `quantumohi-registry`
- `quantumohi-policy-engine`
- `quantumohi-shared-contracts`
- `quantumohi-dev-docs`
- `quantumohi-infra`
- `quantumohi-observability`
- `quantumohi-monorepo-starter` *(optional internal accelerator)*

## 1) quantumohi-com-web

**Purpose:** Public commercial website.

**Stack:** WordPress, WooCommerce, custom theme/child theme, light JS enhancements, webhook handoff to Node services.

```text
quantumohi-com-web/
├── README.md
├── .editorconfig
├── .gitignore
├── .env.example
├── docs/
│   ├── site-map.md
│   ├── page-inventory.md
│   ├── brand-rules.md
│   ├── commerce-language-rules.md
│   └── integration-points.md
├── wp-content/
│   ├── themes/
│   │   └── quantumohi-theme/
│   │       ├── style.css
│   │       ├── functions.php
│   │       ├── front-page.php
│   │       ├── page-platform.php
│   │       ├── page-solutions.php
│   │       ├── page-products.php
│   │       ├── page-services.php
│   │       ├── page-developers.php
│   │       ├── page-docs.php
│   │       ├── page-pricing.php
│   │       ├── page-contact.php
│   │       ├── woocommerce/
│   │       ├── template-parts/
│   │       ├── assets/
│   │       │   ├── css/
│   │       │   ├── js/
│   │       │   ├── img/
│   │       │   └── fonts/
│   │       └── inc/
│   │           ├── enqueue.php
│   │           ├── shortcodes.php
│   │           ├── api-hooks.php
│   │           └── webhook-client.php
│   └── plugins/
│       └── quantumohi-bridge/
│           ├── quantumohi-bridge.php
│           ├── includes/
│           │   ├── class-api-client.php
│           │   ├── class-order-sync.php
│           │   ├── class-certificate-trigger.php
│           │   └── class-stripe-bridge.php
│           └── readme.txt
├── exports/
│   ├── woocommerce-products.csv
│   └── page-content/
└── scripts/
    ├── build-assets.sh
    └── sync-content.sh
```

## 2) quantumohi-execution-gateway

**Purpose:** Single controlled entry point for governed execution.

**Stack:** Node.js, TypeScript, Fastify/Express, OpenAPI, JWT/API key auth, structured logging.

```text
quantumohi-execution-gateway/
├── README.md
├── package.json
├── tsconfig.json
├── .env.example
├── openapi/
│   └── quantumohi-execution.openapi.yaml
├── docs/
│   ├── architecture.md
│   ├── request-lifecycle.md
│   ├── policy-enforcement.md
│   ├── execution-envelope.md
│   └── versioning.md
├── src/
│   ├── server.ts
│   ├── app.ts
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── services/
│   ├── adapters/
│   ├── schemas/
│   ├── utils/
│   └── types/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── contract/
└── .github/workflows/
    ├── ci.yml
    ├── test.yml
    └── release.yml
```

## 3) quantumohi-identity-service

**Purpose:** Identity, access, subject records, account binding.

```text
quantumohi-identity-service/
├── README.md
├── package.json
├── .env.example
├── docs/
├── src/
│   ├── server.ts
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── middleware/
│   ├── schemas/
│   └── utils/
├── tests/
└── .github/workflows/ci.yml
```

## 4) quantumohi-registry

**Purpose:** QR-V, OBP-1, verification records, revocation, public lookup.

```text
quantumohi-registry/
├── README.md
├── package.json
├── .env.example
├── docs/
├── src/
│   ├── server.ts
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── repositories/
│   ├── schemas/
│   ├── utils/
│   └── public/verification-page/
├── migrations/
├── tests/
└── .github/workflows/ci.yml
```

## 5) quantumohi-policy-engine

**Purpose:** Centralized rules and policy evaluation.

```text
quantumohi-policy-engine/
├── README.md
├── docs/
├── policies/
│   ├── execution/
│   ├── commerce/
│   ├── registry/
│   └── compliance/
├── schemas/policy.schema.json
├── validators/validate-policies.ts
└── tests/
```

## 6) quantumohi-shared-contracts

**Purpose:** Canonical contracts shared across all repos.

```text
quantumohi-shared-contracts/
├── README.md
├── package.json
├── src/
│   ├── api/
│   ├── identity/
│   ├── registry/
│   ├── payments/
│   └── common/
├── schemas/
├── changelog/contract-history.md
└── tests/
```

## 7) quantumohi-dev-docs

**Purpose:** Public and internal technical documentation.

```text
quantumohi-dev-docs/
├── README.md
├── docs/
│   ├── overview.md
│   ├── architecture/
│   ├── api/
│   ├── runbooks/
│   ├── standards/
│   └── adr/
└── diagrams/
```

## 8) quantumohi-infra

**Purpose:** Deployment, cloud, environments, secrets references, reverse proxy, containers.

```text
quantumohi-infra/
├── README.md
├── docs/
├── docker/
├── compose/
├── nginx/
├── terraform/
├── scripts/
└── .github/workflows/
```

## 9) quantumohi-observability

**Purpose:** Logging, metrics, alerts, dashboards.

```text
quantumohi-observability/
├── README.md
├── dashboards/
├── alerts/
├── logging/
├── metrics/
└── runbooks/
```

## 10) Optional: quantumohi-monorepo-starter

**Purpose:** Internal accelerator for local development only.

```text
quantumohi-monorepo-starter/
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── apps/
├── packages/
├── tooling/
└── scripts/dev-all.sh
```

## Branching and release model

### Default branches

- `main` → production-ready only
- `develop` → integrated staging branch
- `feature/*` → new work
- `fix/*` → targeted fixes
- `release/*` → release prep
- `hotfix/*` → urgent production repair

### Tagging

- `v1.0.0`
- `v1.0.1`
- `v1.1.0`

## Minimum required files in every repository

- `README.md`
- `LICENSE` or proprietary notice
- `.env.example`
- `.gitignore`
- `docs/`
- `.github/workflows/ci.yml`
- `CODEOWNERS`
- `SECURITY.md`
- `CONTRIBUTING.md`

## Recommended first four repositories for v1

1. `quantumohi-com-web`
2. `quantumohi-execution-gateway`
3. `quantumohi-registry`
4. `quantumohi-shared-contracts`

This foundation is sufficient for purchase, issuance, public verification, and revocation.

## Production boundary rule

- WordPress handles presentation and commerce.
- Execution Gateway handles control.
- Node services handle authority.
- Registry handles truth.
- Shared contracts prevent drift.

## Suggested top-level repository descriptions

### `quantumohi-com-web`
Commercial web layer for QuantumOHI.com, including WordPress theme, WooCommerce integration, and product delivery triggers.

### `quantumohi-execution-gateway`
Governed execution boundary for policy-bound workflows, identity-aware routing, and audit-ready execution envelopes.

### `quantumohi-registry`
Verification and registry service for certificate issuance, lookup, status tracking, and revocation.

### `quantumohi-shared-contracts`
Canonical request, response, and record schemas shared across QuantumOHI services.
