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
