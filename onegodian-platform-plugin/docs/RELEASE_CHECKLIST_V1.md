# OneGodian Platform Plugin v1.0.0 Release Checklist

Use this checklist before publishing the production ZIP for the OneGodian Platform Plugin v1.0.0 release.

## Required Manual Verification

- [ ] **Activation test**: Install and activate the plugin on a clean WordPress site without PHP fatal errors or admin notices.
- [ ] **REST endpoint test**: Confirm the runtime endpoints return valid JSON for `/wp-json/onegodian/v1/health`, `/manifest`, `/tools`, and `/stats`.
- [ ] **Connectors admin test**: Open the OneGodian Platform connector admin screen and verify connector status and test actions render correctly.
- [ ] **Pattern registration test**: Confirm OneGodian block pattern categories and bundled patterns appear in the WordPress block editor.
- [ ] **Navigation overlay display test**: Render each navigation overlay shortcode and verify columns, links, and labels display correctly.
- [ ] **Unified OneGodian style CSS load test**: Confirm `assets/css/onegodian-platform.css` is enqueued on the front end and styles plugin modules consistently.
- [ ] **WooCommerce compatibility test**: Activate WooCommerce alongside the plugin and confirm plugin activation, admin screens, and REST health output remain stable.
- [ ] **Shortcode backward compatibility test**: Confirm legacy OneGodian shortcode tags continue to render or defer to dedicated module plugins when already registered.
- [ ] **Mobile responsive review**: Review core templates, patterns, overlays, and generated pages on mobile breakpoints.
- [ ] **ZIP installation test**: Install `onegodian-platform-plugin-v1.0.0.zip` through the WordPress plugin uploader and confirm the extracted folder is `onegodian-platform-plugin/`.

## Packaging Commands

```bash
chmod +x scripts/build-onegodian-platform-plugin.sh
chmod +x scripts/verify-onegodian-platform-plugin.sh
./scripts/build-onegodian-platform-plugin.sh
./scripts/verify-onegodian-platform-plugin.sh
```
