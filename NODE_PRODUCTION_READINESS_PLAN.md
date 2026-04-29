# Onegodian Repos — Node Production Readiness Plan

## Scope and Focus

This plan narrows immediate production work to a small execution cluster before broad rollout across the entire repository family.

### Priority production candidates

1. `qrv-registry` — verification record authority
2. `qrv-verify` — public verification UI
3. `issuer-qrv` — issuer dashboard / record creation
4. `qrv-api` — shared API gateway layer
5. `onegodian-api` — OneGodian general API
6. `onegodian-org` — public-facing website layer
7. `acc-core` / `acc-api` / `acc-web` — Agent Command Console foundation
8. `onegodian-llm` — advisory intelligence layer
9. `onegodian-history-api` — records / timeline / archive API
10. `qrv-docs` / `qrv-developer-portal` — external integration documentation

### Separation principle

- `Onegodian.org` remains public-facing, interpretive, educational, and identity/community focused.
- Execution authority and deterministic infrastructure must remain in backend service domains.

---

## Production Readiness Standard

A Node repository should not be labeled production-ready until all baseline requirements are present.

### Required Node baseline

- `package.json`
- `README.md`
- `.env.example`
- `.gitignore`
- `src/`
- `tests/`
- `Dockerfile`
- Health endpoint
- Version endpoint
- Error handler
- Structured logging
- Security middleware
- CI workflow
- Deployment notes

### API-specific baseline

- `GET /health`
- `GET /version`
- OpenAPI specification
- JSON schema validation
- RBAC or API-key middleware
- Request ID middleware
- Audit log events
- Rate limiting
- CORS policy
- Helmet/security headers

---

## Priority 1 — QR-V Production Cluster

### 1) qrv-registry

Role: canonical verification record registry.

Production tasks:

- Add `GET /health`
- Add `GET /version`
- Add `GET /records/:id`
- Add `GET /verify/:id`
- Add `POST /records` behind issuer key
- Add canonical demo records
- Add JSON schema validation
- Add audit logs for create/verify/revoke
- Add persistent database adapter
- Add `.env.example`
- Add OpenAPI spec
- Add tests for `VERIFIED` / `REVOKED` / `EXPIRED` / `NOT_FOUND`

Minimum record schema:

```json
{
  "id": "QRV-DEMO-001",
  "status": "VERIFIED",
  "issuer": "ONEGODIAN, LLC",
  "subject": "Demo Verification Record",
  "issued_at": "2026-04-28T00:00:00Z",
  "expires_at": null,
  "revoked_at": null,
  "metadata": {
    "network": "QR-V",
    "version": "1.0.0"
  }
}
```

### 2) qrv-verify

Role: public verification interface.

Production tasks:

- Consume registry API directly
- Render branded result pages
- Support `/verify/:id`
- Support scan/manual lookup
- Handle `VERIFIED` / `REVOKED` / `EXPIRED` / `NOT_FOUND`
- Show issuer, status, timestamp, and reference ID
- Add user-safe error states
- Add Hostinger/Node deployment preset
- Add static fallback page

Target UX:

`Enter QR-V ID → Query Registry → Display Status`

### 3) issuer-qrv

Role: issuer dashboard for creating records.

Production tasks:

- Replace placeholder login with issuer dashboard shell
- Add Create Record form
- Connect `POST /records` to `qrv-registry`
- Add issuer API key support
- Add list records view
- Add revoke record action
- Add environment-driven registry URL
- Add audit log view

### 4) qrv-api

Role: gateway / aggregation layer.

Production tasks:

- Expose unified `GET /v1/verify/:id`
- Expose unified `GET/POST /v1/records`
- Proxy or coordinate `qrv-registry`
- Add API key middleware
- Add rate limiting
- Add request ID
- Add OpenAPI
- Add status payload for service dependencies

---

## Priority 2 — OneGodian Core APIs

### 5) onegodian-api

Role: commercial/public OneGodian data API.

Production tasks:

- Add `/health`
- Add `/version`
- Add `/identity`
- Add `/systems`
- Add `/membership`
- Add `/products`
- Add `/timeline`
- Add `.env.example`
- Add OpenAPI
- Add basic tests

### 6) onegodian-history-api

Role: historical records, chronology, archive/timeline API.

Production tasks:

- Add canonical timeline endpoint
- Add dual-date timestamp model
- Add OTS-V5 converter helper
- Add record hash field
- Add source/reference field
- Add tests for date conversion

Timestamp policy:

- UTC/Gregorian remains system/legal truth.
- Onegodian Time is derived supplemental metadata.

---

## Priority 3 — ACC / Agent Command Console

### 7) acc-core

Role: shared ACC domain logic.

Production tasks:

- Define agent model
- Define workflow model
- Define execution policy model
- Define event model
- Define shared TypeScript types
- Add tests

### 8) acc-api

Role: ACC backend API.

Production tasks:

- `GET /health`
- `GET /version`
- `GET /agents`
- `POST /agents`
- `GET /workflows`
- `POST /workflows`
- `POST /runs`
- `GET /runs/:id`
- Add RBAC
- Add audit logs
- Add OpenAPI

### 9) acc-web

Role: ACC frontend.

Production tasks:

- Agent list
- Workflow list
- Run detail page
- System status panel
- Auth shell
- API client

---

## Production Separation Rule

Recommended domain mapping:

- `onegodian.org` = public education / identity / interpretation
- `onegodian.com` = commercial products / store / licensing
- `api.onegodian.com` = commercial API
- `qrv.network` = verification infrastructure
- `acc.onegodian.com` (or `acc.quantumohi.com`) = internal command console

Language policy:

- Keep governance/INO language separated from ONEGODIAN, LLC commercial claims.
- “Sovereign” should be framed as private self-governance and voluntary internal framework, not nation-state legal authority.

---

## Immediate Repo Checklist

Run against every Node repo:

```bash
node -v
npm -v
npm install
npm audit
npm run lint
npm test
npm run build
npm start
```

Then verify service endpoints:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/version
```

Recommended scripts block:

```json
{
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js",
    "test": "node --test",
    "lint": "eslint .",
    "build": "npm run lint && npm test",
    "audit:prod": "npm audit --omit=dev"
  }
}
```

---

## Suggested Node API Starter (`src/index.js`)

```js
import express from "express";
import helmet from "helmet";
import cors from "cors";
import crypto from "node:crypto";

const app = express();

const PORT = process.env.PORT || 3000;
const SERVICE_NAME = process.env.SERVICE_NAME || "onegodian-node-service";
const SERVICE_VERSION = process.env.SERVICE_VERSION || "0.1.0";

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "1mb" }));

app.use((req, res, next) => {
  req.requestId = req.headers["x-request-id"] || crypto.randomUUID();
  res.setHeader("x-request-id", req.requestId);
  next();
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: SERVICE_NAME,
    version: SERVICE_VERSION,
    timestamp_utc: new Date().toISOString()
  });
});

app.get("/version", (req, res) => {
  res.json({
    service: SERVICE_NAME,
    version: SERVICE_VERSION,
    node: process.version,
    environment: process.env.NODE_ENV || "development"
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "NOT_FOUND",
    message: "Route not found",
    request_id: req.requestId
  });
});

app.use((err, req, res, next) => {
  console.error({
    level: "error",
    service: SERVICE_NAME,
    request_id: req.requestId,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });

  res.status(err.status || 500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    request_id: req.requestId
  });
});

app.listen(PORT, () => {
  console.log(`${SERVICE_NAME} v${SERVICE_VERSION} listening on ${PORT}`);
});
```

---

## Suggested `.env.example`

```env
NODE_ENV=development
PORT=3000
SERVICE_NAME=qrv-registry
SERVICE_VERSION=0.1.0
CORS_ORIGIN=*
DATABASE_URL=
ISSUER_API_KEY=replace_me
REGISTRY_URL=https://registry.qrv.network
VERIFY_URL=https://verify.qrv.network
API_BASE_URL=https://api.qrv.network
```

---

## 7-Day Execution Order

### Day 1
Standardize `package.json`, `.env.example`, `README.md`, `/health`, `/version`.

### Day 2
Finish `qrv-registry` demo records and status logic.

### Day 3
Connect `qrv-verify` to registry and render verified/revoked/expired pages.

### Day 4
Connect `issuer-qrv` create record form to registry.

### Day 5
Add OpenAPI specs and JSON schemas.

### Day 6
Add tests, lint, production audit, and deployment docs.

### Day 7
Deploy QR-V cluster and create public demo:

- `QRV-DEMO-001` → `VERIFIED`
- `QRV-DEMO-002` → `REVOKED`
- `QRV-DEMO-003` → `EXPIRED`
- `QRV-DEMO-404` → `NOT_FOUND`

---

## Bottom Line

Do not attempt to make every repository production-ready at once.

Execute this initial cluster first:

- `qrv-registry`
- `qrv-verify`
- `issuer-qrv`
- `qrv-api`

Make those four clean, documented, testable, and deployable before scaling to additional services.
