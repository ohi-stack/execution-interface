# Production Readiness Report — Issue #178

Date: 2026-05-05 (UTC)

## Scope executed
- Attempted production lock workflow and PR #171 reconciliation.
- Validated local `main` readiness checks requested:
  - `npm install`
  - `npm run lint`
  - `npx tsc --noEmit`
  - `npm run build`
- Attempted deploy via `scripts/deploy-prod.sh`.
- Probed live routes and API endpoints on `https://app.onegodian.com`.
- Reviewed Members plugin bridge expectations and app bridge runtime requirements.

## Results

### 1) PR #171 reconciliation
- Blocked in this environment: repo has no configured `origin` remote, no remote branches, and currently only local branch `work`.
- This prevents fetching/reconciling PR branches directly.

### 2) Local validation
- `npm install`: PASS (dependencies audited; warnings present).
- `npm run lint`: FAIL (`eslint` missing in devDependencies/runtime toolchain as executed by `next lint`).
- `npx tsc --noEmit`: FAIL (TypeScript standard lib files missing under `node_modules/typescript/lib`).
- `npm run build`: FAIL (multiple unresolved module imports plus lockfile parsing warning inside Next patch routine).

### 3) Deploy attempt
- `scripts/deploy-prod.sh`: FAIL.
- Script expects `origin/main`, but no `origin` remote exists in the current git config.

### 4) Live route checks (`app.onegodian.com`)
- `/`: HTTP 200
- `/dashboard`: HTTP 200
- `/omos`: HTTP 404
- `/api/health`: HTTP 404
- `/api/omos/llm/chat`: HTTP 404

### 5) Members plugin bridge configuration validation
- App-side bridge requires `OMOS_API_BASE_URL` and `OMOS_APP_BRIDGE_KEY` to send chat bridge requests.
- WordPress members plugin exposes bridge-protected admin permission via header `x-onegodian-bridge-key` and health payload includes `bridge_configured` flag.
- Given `/api/omos/llm/chat` currently returns 404 on live, bridge path is not production-ready from app edge.

## Readiness decision
**NOT READY FOR PRODUCTION LOCK** under current conditions.

## Blocking items
1. Add/fix remote configuration to enable PR #171 reconciliation and deploy script flow (`origin/main`).
2. Restore lint/type/build toolchain completeness (`eslint`, TypeScript libs).
3. Resolve unresolved app imports causing build failure.
4. Ensure live deployment includes expected OMOS and health API routes (`/omos`, `/api/health`, `/api/omos/llm/chat`).
5. Confirm runtime bridge env vars and key rotation are correctly applied in production.
