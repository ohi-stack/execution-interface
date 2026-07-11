# OneGodian Members v2.1.0 Platform Services Edition

Production-candidate WordPress plugin package consolidating the known OneGodian Members feature line into one installable plugin.

> Build note: the requested historical source ZIP files were not present in this repository checkout or `/workspace`; this package documents the requested feature inventory and implements the consolidated v2.1.0 target from the supplied requirements.

## Feature inventory by package

| Package | Inventory preserved in v2.1.0 |
| --- | --- |
| `onegodian-members-v1.0.0.zip` | Baseline WordPress plugin shell, member role setup, member dashboard shortcode, login shortcode, protected member content gate. |
| `onegodian-members-v1.3.0-production.zip` | Production hardening posture, safe JSON responses, no bundled secrets, capabilities for member management, production documentation. |
| `onegodian-members-v1.4.0-production-auto-pages.zip` | Activation-created pages for dashboard, login, certificate, digital ID, and community surfaces. |
| `onegodian-members-v1.5.0-buddypress-community.zip` | Conditional BuddyPress profile navigation, activity bridge action, community shortcode, graceful fallback when BuddyPress is inactive. |
| `onegodian-members-v1.6.0-admin-ui-tabs.zip` | Latest tabbed admin structure with Overview, Services, Community, Commerce, Protected Content, Auto Pages, and Production Checklist tabs. |
| `onegodian-members-v2.0.0-production.zip` | REST endpoint boundary, platform-service separation, certificates, PDFs, digital IDs, WooCommerce entitlement boundary, Stripe mode boundary, app bridge, protected content, and production status endpoint. |

## v2.1.0 services

The Platform Services Edition declares and exposes boundaries for:

- Auth
- RBAC
- Dashboard
- LMS
- Belief Mapper
- Media
- Galaxy
- Registry
- Certificate / PDF / Digital ID
- WooCommerce
- Stripe
- App Bridge
- Protected Content
- BuddyPress Community
- Auto Pages

## REST endpoints

Namespace: `onegodian-members/v1`

- `GET /status` — public safe status JSON.
- `GET /services` — public service-boundary inventory.
- `GET /dashboard` — authenticated dashboard read model.
- `GET /member/me` — authenticated member profile/capability read model.
- `GET /certificate` — authenticated certificate and digital ID read model.
- `GET /certificate/verify/{id}` — public certificate verification boundary response.
- `GET /entitlements` — authenticated WooCommerce, Stripe, and protected-content entitlement boundary.
- `GET /app-bridge` — public app bridge contract and available route list.

## Shortcodes

- `[onegodian_member_dashboard]`
- `[onegodian_member_login]`
- `[onegodian_member_certificate]`
- `[onegodian_member_digital_id]`
- `[onegodian_member_community]`
- `[onegodian_protected]...[/onegodian_protected]`

## Installation

1. Upload `onegodian-members-v2.1.0-platform-services-edition.zip` through WordPress Plugins → Add New → Upload Plugin.
2. Activate **OneGodian Members**.
3. Confirm the auto-created pages are present.
4. Open **OneGodian Members** in wp-admin and review the Production Checklist tab.
5. Visit `/wp-json/onegodian-members/v1/status` and `/wp-json/onegodian-members/v1/services` to confirm safe JSON responses.

## Security and operations

- No API keys are shipped.
- Stripe settings store only mode metadata in WordPress options; secret key storage must be supplied by a secure production secret-management workflow.
- BuddyPress and WooCommerce integrations are conditional and do not fatal when those plugins are inactive.
- REST responses expose only safe plugin status, route contracts, and current-user read models.
