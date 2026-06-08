# OneGodian Capital Plugin v0.3.1

WordPress + WooCommerce bridge for the OneGodian Capital infrastructure layer.

## Version 0.3.1 Product Sync

Adds `OneGodian Capital → Product Sync` with manual syncing, auto-sync on WooCommerce product save/update, eligible category mapping, last sync time, total synced products, and a product sync log.

Synced product fields include product identity, pricing, stock, category, description, modified timestamp, and Capital classification metadata:

- `capital_product_type`
- `disclosure_required`
- `certificate_enabled`
- `dashboard_visible`
- `app_visible`

Allowed `capital_product_type` values are `capital`, `contribution`, `digital_download`, `certificate`, `membership`, `service`, `course_reference`, and `founder_product`.

## REST API

- `GET /wp-json/onegodian-capital/v1/health`
- `GET /wp-json/onegodian-capital/v1/manifest`
- `GET /wp-json/onegodian-capital/v1/products`
- `GET /wp-json/onegodian-capital/v1/product-sync-status`
- `POST /wp-json/onegodian-capital/v1/products/sync`

Protected product endpoints support `X-OMOS-App-Key` using the generated `ogc_app_bridge_key` option.

## Build

```bash
./scripts/build-onegodian-capital-plugin.sh
```

The build script runs PHP syntax checks first and then produces `onegodian-capital-plugin-v0.3.1-product-sync.zip` at the repository root. The ZIP is a generated release artifact and is intentionally not committed.
