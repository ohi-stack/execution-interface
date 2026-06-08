# Changelog

## 1.0.0 - Production release

- Added production bootstrap with plugin header, constants, safe include loading, and optional dependency protection.
- Added activation workflow for database tables, default options, roles/capabilities, rewrite flushing, and generated pages.
- Added generated marketplace, buyer deals, buyer dashboard, NDA gate, submit interest, and documentation pages.
- Added shortcodes for marketplace overview, deal listings, individual deals, NDA gate, buyer dashboard, and buyer interest forms.
- Added admin screens for dashboard, marketplace deals, buyer interest, NDA records, settings, activity log, and documentation.
- Added buyer workflow covering gated deal review, NDA acceptance, and interest submission.
- Added NDA acceptance records and audit/activity logging.
- Added security hardening with nonces, capability checks, input sanitization, allowlists, and output escaping.
- Added README and operational documentation.
- Documented expected PNG branding filenames without committing binary placeholders, keeping the branch compatible with binary-restricted push policies.
- Added uninstall cleanup that is safe and option-controlled for pages and custom tables.
## 1.0.1 - 2026-06-01

### Fixed

- Corrected production bootstrap syntax so the plugin loads without fatal parse errors.
- Restored the Deal Marketplace renderer markup to a valid, single render flow for public and admin screens.
- Corrected the marketplace cache-clear admin handler and nonce wiring.

### Added

- Added production release package documentation.
- Added documentation and template directories required for the production package manifest.

## 1.0.0 - Previous internal build

### Added

- Initial Algonquian Deal Marketplace runtime, shortcodes, admin dashboard, activation workflow, cache strategy, NDA gate, buyer interest capture, optional suite integration checks, and non-destructive uninstall behavior.
