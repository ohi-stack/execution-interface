# Production Checklist — OneGodian Members v2.1.0

## Package validation

- [x] Version reads `2.1.0` in the plugin header and constant.
- [x] ZIP root folder is `onegodian-members-v2.1.0-platform-services-edition/`.
- [x] No `node_modules` directory is bundled.
- [x] No `.git` directory is bundled.
- [x] No secrets or raw API keys are bundled.
- [x] Plugin header is valid for WordPress discovery.

## Functional validation

- [x] v2.0.0-style REST service boundaries are preserved.
- [x] v1.6.0-style admin tabs are present.
- [x] v1.5.0-style BuddyPress/community integration is conditional and preserved.
- [x] v1.4.0-style auto pages are created on activation.
- [x] Certificates, PDFs, and Digital IDs remain active through service payloads, shortcodes, custom post types, and verification boundary.
- [x] WooCommerce entitlement boundary remains active and detects WooCommerce when installed.
- [x] Stripe boundary remains active without shipping secrets.
- [x] App Bridge endpoint remains active.
- [x] Protected Content shortcode remains active.

## Platform service boundaries

- [x] LMS
- [x] Belief Mapper
- [x] Media
- [x] Galaxy
- [x] Registry
- [x] Certificate
- [x] Dashboard
- [x] Auth
- [x] RBAC

## WordPress runtime checks

- [ ] Install ZIP in a WordPress 6.3+ site.
- [ ] Activate plugin and confirm no fatal error.
- [ ] Confirm auto pages exist.
- [ ] Confirm `/wp-json/onegodian-members/v1/status` returns safe JSON.
- [ ] Confirm `/wp-json/onegodian-members/v1/services` returns service-boundary JSON.
- [ ] Confirm authenticated endpoints require an authenticated user.
