# QR-V / Quantum-OHI Production Readiness Audit

**Audit date:** 2026-04-24  
**Scope:**
- `api.quantumohi.com`
- `acc.quantumohi.com`
- `registry.qrv.network`
- `api.qrv.network`
- `issuer.qrv.network`
- `verify.qrv.network`

## Executive Verdict

**Do not mark the system production-ready yet.**

Current state is best classified as:
- Early deployment / staging infrastructure
- QR-V registry foundation partially operational
- QR-V public verification flow not production-ready
- Issuer portal not production-ready
- ACC not deployed
- Quantum-OHI API not production-ready

---

## Node-by-Node Status

| Node | Current observed state | Production status | Required fix |
|---|---|---|---|
| `api.quantumohi.com` | 503 in screenshot; live fetch returned 404 | Not ready | Deploy real API app; add `/healthz`, `/readyz`, `/version`, and route table |
| `acc.quantumohi.com` | Hostinger "You Are All Set to Go" placeholder | Not ready | Deploy ACC frontend or point DNS to correct app |
| `registry.qrv.network` | Plain text shows registry API running | Partially ready | Add structured API, auth, `/healthz`, `/records/:id`, explorer, DB readiness checks |
| `api.qrv.network` | Screenshot showed issuer portal text; live fetch returned 404 | Partially ready / inconsistent routing | Separate API from issuer portal and expose documented API endpoints |
| `issuer.qrv.network` | 503 in screenshot; live fetch returned 404 | Not ready | Deploy issuer portal frontend and connect to live create routes |
| `verify.qrv.network` | Not found in screenshot; live fetch returned 404 | Not ready | Deploy public verification UI and QRVID resolver routes |

---

## Core Issue

The intended separation of concerns is correct, but public behavior still shows placeholders, 404s, 503s, and smoke-test text.

### Target architecture

- `issuer.qrv.network` → issuer dashboard (create/revoke/manage credentials)
- `api.qrv.network` → backend API (create/verify/revoke/registry queries)
- `registry.qrv.network` → canonical registry service (records/hashes/audit)
- `verify.qrv.network` → public verification UX (QRVID resolution + status)
- `acc.quantumohi.com` → Agent Command Console
- `api.quantumohi.com` → Quantum-OHI / ACC API layer

---

## Minimum Production Acceptance Criteria

1. DNS and SSL valid on every node
2. Every node returns branded landing or structured API response
3. Every backend exposes:
   - `GET /healthz`
   - `GET /readyz`
   - `GET /version`
4. API node supports:
   - `POST /registry/create`
   - `POST /verify` or `GET /verify/:id`
   - `POST /revoke`
5. Verify node supports:
   - `/:qrvid`
   - `/verify/:qrvid`
   - `/not-found`
   - `/revoked`
   - `/expired`
6. Issuer node supports: login, create, QR generation, issued-records view, revoke
7. Registry node supports: registry lookup, hash lookup, issuer lookup, audit writes
8. Admin/auth layer enabled
9. Logs and monitoring enabled
10. DB ingress restricted to known infrastructure IPs (no `0.0.0.0/0` in production)

---

## Immediate Deployment Order

1. **`verify.qrv.network` first**
   - Required routes: `GET /`, `GET /:qrvid`, `GET /verify/:qrvid`, `GET /healthz`, `GET /readyz`
2. **`api.qrv.network` second**
   - Backend-only API; do not host issuer portal here
3. **`issuer.qrv.network` third**
   - Remove demo-mode fallback; enforce live registry writes
4. **`registry.qrv.network` fourth**
   - Replace smoke-test response with structured registry API
5. **`acc.quantumohi.com` fifth**
   - Replace Hostinger placeholder with ACC app shell
6. **`api.quantumohi.com` sixth**
   - Replace 503/404 with stable API shell and versioned response
7. **Cross-cutting hardening**
   - Add auth, monitoring, logging, and network restrictions

---

## Production-ready Statement (Use only after fixes)

> QR-V is operating as a live registry-backed verification network with issuer-side record creation, canonical registry storage, public QRVID resolution, and structured verification responses.

