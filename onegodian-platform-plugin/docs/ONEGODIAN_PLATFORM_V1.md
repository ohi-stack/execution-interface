# OneGodian Platform Plugin v1.0.0

The OneGodian Platform Plugin establishes the OneGodian Premium Infrastructure Standard for WordPress pages, patterns, overlays, connectors, and runtime REST integrations.

## Version

- Plugin header: `1.0.0`
- Runtime constant: `ONEGODIAN_PLATFORM_VERSION = 1.0.0`

## Admin Menu

The plugin registers the following WordPress admin structure:

- OneGodian Platform
  - Dashboard
  - Connectors
  - Runtime
  - App Bridge
  - Documentation

Dashboard widgets include Plugin Status, Runtime Status, Connectors Status, WooCommerce Status, Page Generator, and Pattern Manager.

## Connectors API

Registered connectors:

- OMOS Runtime
- OHI Runtime
- QRV Network
- WooCommerce
- Stripe
- OpenAI
- Gemini
- Claude
- Grok

REST endpoints:

- `/wp-json/onegodian/v1/connectors`
- `/wp-json/onegodian/v1/connectors/status`
- `/wp-json/onegodian/v1/connectors/test`

## Runtime Endpoints

- `/wp-json/onegodian/v1/health`
- `/wp-json/onegodian/v1/manifest`
- `/wp-json/onegodian/v1/tools`
- `/wp-json/onegodian/v1/stats`

All endpoints return JSON through `rest_ensure_response()`.

## Pattern API

Categories:

- `onegodian`
- `omos`
- `ohi`
- `capital`
- `onegodian-time`

Pattern groups include Hero Patterns, CTA Patterns, Card Patterns, Media Patterns, and Compliance Patterns.

## Navigation Overlays

Shortcodes:

- `[onegodian_ecosystem_overlay]`
- `[onegodian_omos_overlay]`
- `[onegodian_capital_overlay]`
- `[onegodian_mobile_overlay]`

## Generated Pages

Activation creates styled pages using the reusable template library, including hero, feature grid, CTA, and compliance footer sections.

## Backward Compatibility

The plugin does not remove existing functionality. Legacy shortcode tags are registered only when another plugin has not already registered them, allowing dedicated modules for WooCommerce, Belief Mapper, member resources, and contributor systems to continue taking precedence.

## Production ZIP Build

The distributable ZIP is intentionally generated locally and ignored by Git so repository pushes do not include binary release artifacts. Build and verify it with:

```bash
chmod +x scripts/build-onegodian-platform-plugin.sh
chmod +x scripts/verify-onegodian-platform-plugin.sh
./scripts/build-onegodian-platform-plugin.sh
./scripts/verify-onegodian-platform-plugin.sh
```

The build script produces `onegodian-platform-plugin-v1.0.0.zip` at the repository root and verifies archive integrity with `unzip -t`. The verification script confirms plugin structure, version metadata, required files, class registrations, REST route strings, and the one-folder ZIP layout.
