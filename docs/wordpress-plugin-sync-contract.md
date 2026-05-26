# WordPress Plugin Sync Contract

OMOS runtime is the canonical plugin sync authority for:
- OneGodian.com
- OneGodian.org
- QuantumOHI.com

## Endpoints
- `GET /api/plugin-consumers`
- `GET /api/plugin-shortcodes`
- `GET /api/plugin-sync`
- `GET /api/manifest` (includes plugin sync metadata)

## Shortcodes
- `[omos_manifest]`
- `[omos_runtime_status]`
- `[omos_bridge_builder]`
- `[omos_tool_grid]`
- `[omos_docs_grid]`

## Response conventions
- JSON responses return HTTP 200 on success.
- `?pretty=1` returns formatted JSON for direct browser readability.
- Default output remains machine-readable JSON.
