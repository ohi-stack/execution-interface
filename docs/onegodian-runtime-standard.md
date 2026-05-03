# OneGodian Runtime Standard

Status: Production execution standard
Scope: WordPress plugins, Next.js apps, Node APIs, ODIN, QRV, Galaxy, ACC
Owner: ONEGODIAN runtime architecture

## 1. Purpose

The OneGodian Runtime Standard defines the minimum operational contract every OneGodian production service must satisfy before it is treated as deployable.

This standard preserves the correct separation of responsibilities:

| Layer | Responsibility |
| --- | --- |
| WordPress | UI, commerce, content, SEO, public pages, shortcodes, rendered blocks |
| Node | APIs, runtime execution, registry services, verification, signed responses |
| ODIN | Authoritative records and registry truth |
| Galaxy | Universe, planetary canon, media network, store routing |
| QRV | Verification, trust, public lookup, proofs |
| ACC | Orchestration, control plane, workflow coordination, operational command |

WordPress must never become the authority layer. WordPress authenticates, proxies, caches, renders, and reports. Node APIs and registry services remain the source of runtime and verification authority.

## 2. Required Environment Variables

Every Node/Next.js repo must ship a `.env.production.example` containing the following keys:

```bash
NODE_ENV=production

PUBLIC_BASE_URL=
API_BASE_URL=

ODIN_BASE_URL=https://odin.onegodian.com
GALAXY_BASE_URL=https://galaxy.onegodian.com
QRV_BASE_URL=https://qrv.network

WORDPRESS_BASE_URL=https://onegodian.com

NEXTAUTH_URL=
NEXTAUTH_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

X_OMOS_APP_KEY=
```

WordPress bridge plugins must expose matching admin settings for the base URLs and bridge key, but secrets must be stored using WordPress options with capability-gated admin access and never printed to public HTML.

## 3. Required Service Endpoints

Every deployable service should expose the same minimum endpoint set:

| Endpoint | Purpose | Public | Auth Required |
| --- | --- | --- | --- |
| `/health` | Basic service health and uptime | Yes | No |
| `/manifest` | Machine-readable service identity, routes, version, dependencies | Yes | No, unless internal-only service |
| `/tools` | Available tools/capabilities for app bridge and ACC | Conditional | Prefer bridge key for private tools |
| `/stats` | Safe operational counts and readiness metrics | Conditional | Yes for sensitive metrics |
| `/version` | Build/version metadata | Yes | No |

Next.js apps may expose equivalent `/api/health`, `/api/manifest`, `/api/tools`, `/api/stats`, and `/api/version` routes when root-level endpoints are not practical.

## 4. Required Headers

All WordPress-to-Node bridge requests must support:

```http
X-OMOS-App-Key: <shared bridge key>
X-OneGodian-Source: wordpress|app|acc|qrv|odin|galaxy
X-OneGodian-Module: <module-slug>
```

Recommended response headers:

```http
X-OneGodian-Service: <service-name>
X-OneGodian-Version: <version>
X-OneGodian-Trace-Id: <request-trace-id>
```

## 5. Manifest Format

Each service manifest should use this shape:

```json
{
  "service": "execution-interface",
  "name": "OneGodian Everything App",
  "version": "0.1.0",
  "status": "in-development",
  "publicBaseUrl": "https://app.onegodian.com",
  "apiBaseUrl": "https://api.onegodian.org",
  "ownerLayer": "Node",
  "dependencies": {
    "wordpress": "https://onegodian.com",
    "odin": "https://odin.onegodian.com",
    "galaxy": "https://galaxy.onegodian.com",
    "qrv": "https://qrv.network"
  },
  "endpoints": {
    "health": "/api/health",
    "manifest": "/api/manifest",
    "tools": "/api/tools",
    "stats": "/api/stats",
    "version": "/api/version"
  }
}
```

## 6. WordPress Bridge Rules

The WordPress adapter/plugin must:

1. Authenticate bridge calls using `X-OMOS-App-Key`.
2. Proxy Node API calls instead of duplicating runtime logic.
3. Cache safe responses where appropriate.
4. Render blocks, shortcodes, admin cards, and status widgets.
5. Provide admin settings for service URLs and bridge keys.
6. Include API tester and health indicators.
7. Fail safely with configured fallback content.
8. Avoid storing registry truth, governance truth, or verification truth.

## 7. Deployment Standard

Each production repo should include:

- `.env.production.example`
- `/docs/DEPLOYMENT.md`
- `/docs/RUNTIME-STANDARD.md` or link to this standard
- PM2 config where Node is deployed directly
- Dockerfile where container deployment is intended
- NGINX reverse proxy example for Hostinger/VPS routing
- Build/lint/test commands documented in README

## 8. Production Gate

A repo is not production-ready unless the following pass:

- Environment variables documented
- Health endpoint returns JSON
- Manifest endpoint returns JSON
- Version endpoint returns build/version metadata
- Secrets are absent from source code
- WordPress bridge key is supported where applicable
- Deployment instructions exist
- Build and lint commands are defined
- Fallback handling is documented

## 9. Immediate Implementation Priority

1. `execution-interface` — runtime shell, status routes, developer routes, ecosystem health.
2. `onegodian-api` — common API contract for health, manifest, tools, stats, version.
3. `acc-wp-adapter` — WordPress bridge plugin with admin settings, proxy, cache, API tester.
4. `qrv-api` and `qrv-verify` — verification endpoints and signed response standard.
5. `onegodian-galaxy` — planet schema, codex routes, media/store routing, manifest.
6. `acc-infra` and `qrv-infra` — Hostinger/VPS deployment templates.
