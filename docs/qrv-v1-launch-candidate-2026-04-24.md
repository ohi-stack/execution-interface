# QR-V v1 Production Launch Candidate (Post-PR #56 Audit)

**Audit date:** 2026-04-24  
**Branch state audited:** `work` at merge commit `56e7082` (PR #56) + included change commit `ee29f41`.

## 1) Main Branch Audit Summary (after PR #56 merge)

- Core API and verification routes are present for create/verify/revoke flows (`/api/v1/registry/create`, `/api/v1/verify/:qrvid`, `/api/v1/revoke`).
- Runtime validation and access controls exist (Zod schema validation, API key middleware, basic rate limiter).
- Current record persistence is still in-memory Map storage (non-durable), so process restart causes data loss.
- Prior readiness docs/checklists exist, but there is no automated release-tag workflow and no generated consolidated root changelog.
- Issuer admin protection exists in identity engine (`/admin`) via header token gate, but issuer-specific production auth integration for dedicated issuer node is still incomplete.

## 2) Remaining v1.0.0 Blockers

### Critical blockers
1. **Postgres persistence (P0):**
   - `src/services/recordStore.js` still uses in-memory `Map` and does not write/read from Postgres.
   - This blocks production durability and multi-instance consistency.
2. **Deployment scripts (P0):**
   - Backup/export scripts exist, but no end-to-end production deploy/cutover scripts per node.
   - Missing idempotent deployment automation for API/verify/issuer/registry.
3. **SSL/domain health checks (P0):**
   - No automated domain + TLS validation workflow for `api/verify/issuer/registry` hosts.
   - This increases go-live risk and incident detection lag.

### High-priority blockers
4. **Issuer dashboard auth hardening (P1):**
   - Current middleware pattern supports admin-token checks, but issuer production auth for `issuer.qrv.network` is not fully integrated and verified.
5. **Environment validation standardization (P1):**
   - Strong env validation exists in identity engine; not standardized as a shared launch gate across all QR-V runtime services.

## 3) Priority Order for Remaining Work

1. **Postgres persistence**
2. **Deployment scripts**
3. **SSL/domain health checks**
4. **Issuer dashboard auth**
5. **Env validation unification**

## 4) v1.0.0 Release Readiness Score

**Release score: 7.4 / 10**

### Score rationale
- API contract and request hardening are materially improved.
- Documentation coverage is strong.
- Remaining gaps are mostly operational + persistence-critical and must be closed before v1.0.0.

## 5) ETA to v1.0.0 after fixes

**Estimated ETA: 4–6 days after implementation starts**, assuming:
- Postgres migration + integration and test updates complete in 1–2 days.
- Deploy automation + health checks complete in 1–2 days.
- Issuer auth and env validation standardization complete in 1 day.
- Final smoke/cutover rehearsal passes in under 1 day.

## 6) Production Cutover Checklist

## `api.qrv.network`
- [ ] DNS A/AAAA and CNAME records resolve correctly from at least two regions.
- [ ] TLS certificate valid (SAN includes `api.qrv.network`) with > 21 days before expiry.
- [ ] `GET /healthz`, `GET /readyz`, and `GET /version` return 200 with build metadata.
- [ ] `POST /api/v1/registry/create`, `GET /api/v1/verify/:qrvid`, `POST /api/v1/revoke` pass smoke tests.
- [ ] API key, rate limit, and structured error responses verified.
- [ ] Logs + alerting active for 4xx/5xx and latency.

## `verify.qrv.network`
- [ ] DNS and TLS validated.
- [ ] Landing page loads with branded UI.
- [ ] `/:qrvid` and `/verify/:qrvid` resolve valid, revoked, expired, and not-found cases.
- [ ] `GET /healthz` and `GET /readyz` return passing checks.
- [ ] Synthetic monitor probes each verification state every 5 minutes.

## `issuer.qrv.network`
- [ ] DNS and TLS validated.
- [ ] Authentication enabled (no demo/fallback mode in production).
- [ ] Issuer-only routes require authenticated issuer role.
- [ ] Issue/revoke actions write to canonical registry and produce audit events.
- [ ] Admin emergency lockout and token rotation runbook validated.

## `registry.qrv.network`
- [ ] DNS and TLS validated.
- [ ] Postgres connectivity confirmed with pooled connections and migration version checks.
- [ ] Read/write endpoints validated against production schemas.
- [ ] Backup job + restore drill pass criteria met.
- [ ] Audit log persistence and retention policy verified.

## 7) Files changed for this launch candidate pass

- `.github/workflows/release-tag.yml`
- `CHANGELOG.md`
- `docs/qrv-v1-launch-candidate-2026-04-24.md`
