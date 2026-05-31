# Algonquian Revenue Systems

WooCommerce monetization module for the Algonquian Real Estate plugin suite. The plugin is safe to activate before WooCommerce is installed: checkout buttons remain in pending mode and admin screens show configuration status until WooCommerce and the Stripe gateway are available.

## Capabilities

- **Plugin licensing** — completed WooCommerce orders and active WooCommerce Subscriptions issue a stable user license key, tier assignment, and active/inactive status.
- **Digital product store** — `[algq_monetization_store]` renders contract packs, spreadsheets, calculator libraries, checklists, and training products from mapped WooCommerce product IDs.
- **Subscription tiers** — `[algq_subscription_tiers]` renders Investor, Buyer, Pro, and Enterprise cards with WooCommerce add-to-cart links when products are mapped.
- **Download protection** — `[algq_protected_downloads]` lists WooCommerce customer downloads for logged-in users, and the download permission filter blocks mapped products when the account does not meet the required tier.
- **Stripe integration** — the admin settings screen detects WooCommerce plus WooCommerce Stripe Gateway classes and keeps Stripe checkout delegated to the official WooCommerce payment flow.

## Setup

1. Activate WooCommerce and create digital/downloadable products.
2. Install and configure the WooCommerce Stripe Gateway for test or live mode.
3. Activate `algq-revenue-systems`.
4. Open **WooCommerce → Algonquian Monetization** and map product IDs to subscription tiers and downloads.
5. Add the public shortcodes to store, pricing, account, or buyer-portal pages.

## Shortcodes

- `[algq_monetization_store]`
- `[algq_subscription_tiers]`
- `[algq_protected_downloads]`
- `[algq_license_status]`

## REST endpoint

Authenticated users can call `GET /wp-json/algq/v1/license/status` to retrieve active status, license key, tier, tier label, and Stripe readiness for connected app experiences.
