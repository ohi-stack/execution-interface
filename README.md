# Wallet Core Engine (WCE) v0.1

Config-driven, modular TypeScript monorepo for transaction intent evaluation and execution.

## Monorepo Layout

- `packages/keyvault`: deterministic key derivation + signing (no private key export)
- `packages/chain-adapters-evm`: build/sign/broadcast EVM Send + Approve transactions
- `packages/registry`: versioned chain/token registry bundle loader
- `packages/verify`: signature verification for registry/policy bundles
- `packages/rpc-router`: multi-provider JSON-RPC routing with health and failover
- `packages/policy`: tx_intent policy evaluation to ALLOW/DENY/REQUIRE_CONFIRMATION with reason codes
- `packages/audit`: append-only JSONL audit sink with correlation IDs
- `packages/telemetry`: schema allowlisting + redaction + OTLP export targets

## Design Constraints (Implemented)

- **Config-driven with tenant overlays** in each module (`tenantOverlays` support)
- **No client-specific core logic**: all behavior is driven by typed config/rules
- **Strict telemetry separation**: distinct public and internal telemetry channels/config

## Quick Start

```bash
npm install
npm run build
npm run typecheck
```

## Configuration Assets

- Schema docs: `docs/schemas/wce-config-schema.md`
- Example base config: `examples/configs/base.tenant-a.json`
- Example overlay: `examples/configs/tenant-overlay.high-risk.json`

## Package Notes

### keyvault
- Deterministic `keyId` derivation from tenant + derivation path.
- Signing API only returns signatures and key references.
- Private key material is never exported by API.

### chain-adapters-evm
- Supports two intent types: `SEND` and `APPROVE`.
- `buildUnsignedTx` composes canonical tx shape.
- `signTx` and `broadcastTx` are injected integrations.

### policy
- Evaluates intents against ordered rules.
- Returns `{decision, reasonCode, matchedRuleId}`.
- Defaults are explicit to avoid silent allowance.

### telemetry
- Enforces per-channel schema allowlist.
- Redacts configured fields before export.
- Uses separate OTLP endpoints for public/internal streams.
# OneGodian Verify Portal

`onegodian-verify-portal` is the public verification resolution interface for the OneGodian ecosystem and the QR-V™ Global Verification Network. It is designed to run at `https://verify.qrv.network` and resolve QRVID lookups against `https://api.qrv.network`.

## What this service does

- Resolves QRVIDs from direct URLs or manual input.
- Calls the upstream verification API (`GET /verify/:qrvid`).
- Renders deterministic states (`VERIFIED`, `REVOKED`, `EXPIRED`, `NOT_FOUND`, `UNAVAILABLE`).
- Exposes governance APIs under `/api/omos` and verification core APIs under `/api/v1`.
- Provides operational health and architecture views.

## Routes

### Auth/System
- `GET /health`

### API/Core
- `POST /api/v1/records`
- `GET /api/v1/verify/:qrvid`
- `POST /api/v1/records/:qrvid/revoke`
- `GET /api/omos/identity-definition`
- `POST /api/omos/classify`
- `POST /api/omos/align`
- `POST /api/omos/timestamp/convert`
- `POST /api/omos/decision/run`

### Pages/UI
- `GET /`
- `GET /system-architecture`
- `POST /verify`
- `GET /verify/:qrvid`
- `GET /:qrvid`

## Quickstart

### Requirements
- Node.js 20+
- npm 10+

### Setup
```bash
npm install
cp .env.example .env
```

### Run
```bash
npm run build
npm start
```
Open `http://localhost:3000`.

## Environment variables

Use `.env.example` as your baseline:

```env
PORT=3000
NEXT_PUBLIC_API_URL=https://api.qrv.network
API_BASE_URL=https://api.qrv.network
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000
EXECUTE_API_KEY=replace_with_random_secret
```

## Quality gates

```bash
npm run lint
npm run typecheck
npm test
npm run test:root
npm run build
npm run check
```

## Deployment

### Standard Node runtime
1. Build the app with `npm run build`.
2. Install production deps with `npm install --omit=dev`.
3. Set `NODE_ENV=production` and API URL env vars.
4. Start using `npm start`.
5. Verify `GET /health`.

### Docker
```bash
docker build -t onegodian-verify-portal .
docker run --rm -p 3000:3000 --env-file .env onegodian-verify-portal
```

## Troubleshooting

- **`npm run build` fails with missing type declarations**: run `npm install` to ensure dev dependencies are present.
- **`/verify/:qrvid` shows unavailable**: validate outbound network access and `NEXT_PUBLIC_API_URL`.
- **Invalid identifier errors**: ensure values follow `QRV-123456789` format.
- **Port collision**: set `PORT` to an open port.

## Security notes

- Input is sanitized server-side before outbound requests.
- No direct database access is exposed in this service.
- Unavailable upstream responses render deterministic safe defaults.

## Canonical QR-V registry dependency

`/api/v1/verify/:qrvid` now reads from the canonical QR-V registry tables, with `qr_objects` as the primary source.

- Required: `qr_objects`, `qr_hash_registry`
- Optional joins (graceful fallback if missing): `qr_certificates`, `qr_issuers`
- Reference tables available in the registry schema: `qr_objects`, `qr_hash_registry`, `qr_certificates`, `qr_issuers`, `qr_audit_log`

## QuantumOHI portfolio blueprint

For the proposed QuantumOHI multi-repository production layout, see `docs/quantumohi-repo-map.md`.

## Delivery hardening

- CI workflow: `.github/workflows/ci.yml`
- Branch protection enforcement guide: `docs/branch-protection-enforcement.md`
- WordPress bridge plugin scaffold: `wp-content/plugins/quantumohi-bridge/`

## License

- Execution endpoint (`POST /execute`) requires `x-api-key` matching `EXECUTE_API_KEY`.
- Configure `CORS_ORIGINS` in production to a comma-separated allowlist.
