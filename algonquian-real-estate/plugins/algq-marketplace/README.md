# Algonquian Deal Marketplace

Production-hardened WordPress plugin for Algonquian Real Estate buyer deal distribution, NDA gates, buyer-interest routing, and audited marketplace administration.

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
