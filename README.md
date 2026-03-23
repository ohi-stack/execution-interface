# execution-interface

A reusable, auditable execution interface for processing structured intake, applying rules, enforcing refusals, and producing verified outputs across legal, financial, and operational workflows.

---

## Purpose

This repository defines a **process-first execution interface**, not a collection of ad-hoc scripts.

The system is designed to:
- Accept structured intake
- Validate against explicit schemas
- Apply deterministic rules
- Enforce refusal conditions
- Produce traceable, auditable outputs

All behavior is driven by **configuration and templates**, not hardcoded logic.

---

## Design Principles

- **Interfaces over implementations**
- **Configuration over customization**
- **Refusal is a first-class outcome**
- **Every execution is auditable**
- **No side effects without explicit authorization**

People rotate. Interfaces persist.

---

## High-Level Flow

1. Intake received (structured input)
2. Schema validation
3. Rule evaluation
4. Refusal or approval decision
5. Output generation
6. Audit log written

---

## Issuer QR-V portal scaffold

The runnable issuer control plane now lives under `nodejs/issuer-qrv/` so it matches the expected install/start flow.

```text
nodejs/
  issuer-qrv/
    public/
      assets/
    src/
      components/
      pages/
      services/
      styles/
      utils/
    package.json
    server.js
```

### Portal modules

The front-end is organized around the issuer control plane responsibilities:
- `dashboard` for KPI and activity monitoring
- `issue` for record creation and QR generation
- `records` for issued record management
- `revoke` for lifecycle control
- `analytics` for verification trends
- `api-keys` for integration credentials
- `settings` for operational configuration

### Local demo endpoints

The included Node server exposes mock issuer APIs for local development:
- `GET /`
- `GET /issuer-qrv`
- `GET /api/records`
- `POST /api/registry/create`
- `GET /api/verify/:qrvid`
- `POST /api/revoke`
- `GET /api/analytics`
- `GET /api/api-keys`

Run the app with:

```bash
cd nodejs/issuer-qrv
npm install
node server.js
```

Then open `http://localhost:3000/`.

---

## Non-Goals

This repository does **not**:
- Execute payments
- Call external services by default
- Store secrets
- Contain business-specific logic

Those concerns belong in downstream adapters.

---

## Status

This repository is in **interface-definition phase**.
Structure and contracts are stabilized before behavior is implemented.
