# Algonquian Deal Marketplace

Production-hardened WordPress plugin for Algonquian Real Estate buyer deal distribution, NDA gates, buyer-interest routing, and audited marketplace administration.
The Deal Marketplace module introduces ARE monetization and distribution foundations for buyer-facing deal inventory, NDA gating, buyer interest capture, cache management, and safe production packaging.

## Features

- Primary bootstrap with WordPress plugin header, constants, safe include loading, and optional-dependency tolerance.
- Activation hook that creates buyer offers, NDA acceptance, access log, and activity log tables.
- Automatic generation of buyer-facing pages with correct shortcodes.
- Frontend shortcodes for marketplace overview, deal lists, individual deals, NDA gate, buyer dashboard, and buyer interest submissions.
- Admin screens for dashboard, deals, buyer interest, NDA records, settings, activity, and documentation.
- Role/capability model for administrators, marketplace managers, and verified buyers.
- Nonce verification, strict sanitization, allowlisted status/visibility/access values, and escaped output.
- Option-controlled uninstall cleanup for generated pages and custom tables.
- Repository-safe asset workflow: CSS/JS are versioned, while production PNG artwork is documented for Media Library or release-artifact delivery to avoid binary push restrictions.

## Installation

1. Copy `algq-marketplace` into `wp-content/plugins/`.
2. Confirm WordPress 6.0+ and PHP 7.4+ are available.
3. Activate **Algonquian Deal Marketplace** from **Plugins**.
## Shortcodes

```text
[algq_marketplace]
[algq_deal_marketplace]
```

## Activation

Activation creates required database tables, adds default options, creates roles/capabilities, flushes rewrite rules, and generates marketplace pages.

## Generated pages

- Deal Marketplace — `[algq_deal_marketplace]`
- Buyer Deals — `[algq_marketplace_deals]`
- Buyer Dashboard — `[algq_buyer_dashboard]`
- NDA Gate — `[algq_marketplace_nda_gate]`
- Submit Interest — `[algq_buyer_interest_form]`
- Marketplace Documentation / Getting Started — `[algq_deal_marketplace view="documentation"]`

## Shortcodes

- `[algq_deal_marketplace]`
- `[algq_marketplace_deals]`
- `[algq_marketplace_deal]`
- `[algq_marketplace_nda_gate]`
- `[algq_buyer_dashboard]`
- `[algq_buyer_interest_form]`

## Admin screens

- Dashboard
- Marketplace Deals
- Buyer Interest
- NDA Records
- Settings
- Activity Log
- Documentation

## Buyer workflow

1. Buyer logs in with verified buyer permissions.
2. Buyer reviews gated marketplace inventory.
3. Buyer accepts the NDA gate for a deal.
4. Buyer submits interest, offer amount, and contact details.
5. Marketplace manager reviews interest and activity logs.

## Permissions

Administrators receive full access. Marketplace managers receive operational access to deal, settings, and buyer activity screens. Verified buyers receive buyer-facing marketplace access and interest submission rights only.

## Branding assets

The plugin includes Algonquian Real Estate admin/public CSS and JavaScript. Production PNG artwork should be supplied by the design/media pipeline using the expected filenames documented in `assets/img/README.md`; binary placeholders are not committed so repository pushes remain text-only.

## Security notes

All submitted settings, forms, AJAX, and bulk actions use nonce checks. Incoming fields are sanitized; status, visibility, and access-level fields use allowlists. Rendered text, URLs, attributes, notices, admin cells, and frontend templates are escaped.

## Changelog reference

See [CHANGELOG.md](CHANGELOG.md) for release history.
```text
GET /wp-json/algq/v1/marketplace
```

## Generated pages

Activation declares and creates the public ARE Marketplace page when a WordPress environment is available:

- `deal-marketplace` — renders `[algq_marketplace]`

## Release validation

See [`RELEASE_VALIDATION.md`](RELEASE_VALIDATION.md) for the final production-hardening checklist covering PHP lint, PHPUnit smoke testing, activation, generated pages, shortcodes, buyer flows, marketplace listings, deal detail access, NDA gates, interested-buyer submission, admin dashboard, cache clearing, optional suite-plugin inactivity, and uninstall behavior.

Uninstall is non-destructive by default. Marketplace tables and generated options are deleted only when an administrator explicitly enables **Delete marketplace tables and generated options during uninstall** before uninstalling.

## PHPUnit tests

The plugin includes a safe PHPUnit suite in `tests/` with `phpunit.xml.dist`. The suite is designed to avoid production database access and external network calls.

### Install the WordPress test suite

The tests can run in two modes:

1. **Lightweight shim mode** — no WordPress test suite is required. The bootstrap registers small WordPress function shims so plugin loading, shortcodes, capabilities, sanitization, activation declarations, and generated page definitions can be verified safely.
2. **Full WordPress mode** — install the official WordPress test suite and set `WP_TESTS_DIR` to its path before running PHPUnit.

A typical local WordPress test-suite setup is:

```bash
svn co https://develop.svn.wordpress.org/trunk/ /tmp/wordpress-develop
cd /tmp/wordpress-develop
bash bin/install-wp-tests.sh wordpress_test root '' localhost latest
export WP_DEVELOP_DIR=/tmp/wordpress-develop
export WP_TESTS_DIR=/tmp/wordpress-develop/tests/phpunit
```

Adjust the database name, user, password, and host for your local development machine. Do not point the WordPress test suite at a production database.

### Run PHPUnit

From this plugin directory:

```bash
phpunit -c phpunit.xml.dist
```

If PHPUnit is installed through Composer in a parent project, use that binary instead, for example:

```bash
../../vendor/bin/phpunit -c phpunit.xml.dist
```

### What the suite verifies

- The main plugin file exists and loads without fatal errors.
- Required plugin constants are defined.
- Core plugin, activation, and sanitization classes exist after bootstrap.
- The `[algq_marketplace]` shortcode is registered and renders expected markup.
- Marketplace capabilities are declared for administrator, marketplace manager, and investor roles.
- Sanitization helpers return safe text, keys, URLs, and textarea values.
- The activation class and `activate()` method exist.
- Generated page definitions are available and include the marketplace shortcode page.

### What is intentionally not tested without full WordPress

In lightweight shim mode, tests intentionally do not exercise real database writes, role persistence, REST dispatch through WordPress core, page creation through `wp_insert_post()`, or interactions with other production plugins. Those behaviors should be covered in a full WordPress test environment or staging site with disposable data.



## UI polish assets

Version 1.0.1 ships text-only public and admin assets. The public view includes a branded marketplace hero, buyer dashboard summary cards, premium and locked deal states, NDA-required badges, and styled buyer interest forms. The admin view includes executive cards, marketplace health and cache panels, optional integration status cards, settings quick view panels, shortcode copy controls, and a styled buyer interest / NDA status table with responsive mobile behavior. Binary image assets are intentionally excluded.

## Production validation notes

Version 1.0.1 includes final validation coverage for activation, generated pages, shortcode rendering, admin menu registration, buyer interest submission, the NDA gate notice, cache clearing, inactive optional plugin checks, and non-destructive uninstall behavior. See `../../docs/deal-marketplace-validation.md` for the release checklist.

## Uninstall behavior

Uninstall is non-destructive by default. Marketplace tables, generated pages, and options remain in place unless `cleanup_on_uninstall` is enabled in `algq_deal_marketplace_options` before uninstalling in a disposable or approved cleanup environment.

## Production package

Generate the validated release artifact locally as `algq-deal-marketplace-1.0.1-production.zip`; the ZIP is intentionally ignored and not committed so binary package files do not block pushes.
