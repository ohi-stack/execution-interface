# OMOS Node Runtime

Production runtime and documentation platform for **https://omos.onegodian.com**.

## Runtime
- Node >=20
- Express server entrypoint: `server.js`
- Start: `npm start`

## Public Endpoints
- /health
- /api/health
- /manifest
- /api/manifest
- /process (requires `x-omos-key`)
- /dashboard

## Public Routes
- /
- /omos
- /ohi
- /models
- /tools
- /artifacts
- /docs
- /shop
- /latest-news
- /dashboard
- /legal
- /contact
- /protocol
- /algorithm
- /digital-sanctuary

## Validation
- `npm run check`
- `npm run smoke`
- `npm run smoke:pages`

## Compliance Positioning
ONEGODIAN, LLC is the commercial/IP/software entity. OMOS is a voluntary educational, documentation, runtime-support, protocol, and systems architecture layer.

## WordPress plugin shortcode list

- `[algq_deal_intake]`
- `[algq_mao_engine]`
- `[algq_offer_generator]`
- `[algq_pipeline_crm]`
- `[algq_buyer_portal]`
- `[algq_product_library]`
- `[omos_manifest]`
- `[omos_runtime_status]`
- `[omos_bridge_builder]`
- `[omos_tool_grid]`
- `[omos_docs_grid]`

## Algonquian Offer Generator module layout

- `algq-offer-generator/` — standalone Offer Generator module package with `plugin/`, `docs/`, and `tests/` source areas.

## WPBakery shortcode usage

```text
[vc_column_text]
[algq_offer_generator]
[/vc_column_text]
```

## Production ZIP Build

Build and verify the OneGodian Platform Plugin production ZIP locally before publishing a release artifact:

```bash
chmod +x scripts/build-onegodian-platform-plugin.sh
chmod +x scripts/verify-onegodian-platform-plugin.sh
./scripts/build-onegodian-platform-plugin.sh
./scripts/verify-onegodian-platform-plugin.sh
```

The generated `onegodian-platform-plugin-v1.0.0.zip` file is a release artifact and should not be committed unless the repository release policy explicitly changes to allow generated ZIP files.
