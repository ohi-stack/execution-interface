# Algonquian Revenue Systems

WooCommerce monetization module for the Algonquian Real Estate plugin suite. The plugin treats WooCommerce as the commerce backbone for a full ARE revenue operating system instead of a single checkout surface. It is safe to activate before WooCommerce is installed: checkout buttons remain in pending mode and admin screens show configuration status until WooCommerce, WooCommerce Subscriptions, and Stripe are available.

## Revenue Architecture

- **Digital products** — contracts, templates, forms, calculators, AI prompts, SOPs, courses, documents, checklists, and playbooks.
- **Plugin licensing** — independent licensing for Deal Intake, Pipeline CRM, MAO Engine, Offer Generator, Funding Tracker, Buyer Portal, Document Library, and Command Center.
- **Memberships and subscriptions** — Free, Investor, Operator, SaaS Platform, and Institutional tiers.
- **Marketplace revenue** — listing fees, featured placement, buyer access, premium market access, and assignment success-fee readiness.
- **Investor products** — deal packages, market reports, funding templates, and deal intelligence subscription products.
- **Education products** — Wholesaling, Creative Finance, Multifamily Acquisition, and ARE Certification.
- **Services** — acquisition setup, automation setup, CRM implementation, and custom development products.
- **SaaS billing** — Stripe-ready recurring billing delegated to WooCommerce Subscriptions.

## Capabilities

- **Product mapping** — admin tables map WooCommerce product IDs to every revenue lane: memberships, plugin licenses, digital downloads, courses, and services.
- **Plugin licensing** — completed WooCommerce orders and active WooCommerce Subscriptions issue a stable user license key, tier assignment, status, expiration date, and activation records.
- **License API** — `/wp-json/algq/v1/license` supports authenticated status checks and administrator issue requests. `/activate`, `/deactivate`, and `/renew` routes support license lifecycle operations.
- **Digital product store** — `[algq_monetization_store]` renders ARE launch products including Acquisition Bundle, Wholesale Toolkit, Investor Toolkit, ARE Operations Pack, and Deal Intelligence Subscription.
- **Subscription tiers** — `[algq_subscription_tiers]` renders Free, Investor, Operator, SaaS Platform, and Institutional cards with WooCommerce add-to-cart links when products are mapped.
- **Customer dashboard** — `[algq_customer_dashboard]` shows active licenses, status, expiration dates, downloads, and protected download access.
- **Download protection** — `[algq_protected_downloads]` lists WooCommerce customer downloads for logged-in users, and the download permission filter blocks mapped products when the account lacks tier access or the license is expired.
- **Revenue dashboard** — `[algq_revenue_dashboard]` displays Daily Revenue, Monthly Revenue, MRR, ARR, LTV, Churn, Active Subscriptions, Orders, Refunds, Downloads, and Conversion Rate placeholders for analytics integration.
- **Command Center integration** — the Command Center automatically embeds the revenue dashboard panel when `algq-revenue-systems` is active.
- **Stripe integration** — checkout remains delegated to the official WooCommerce payment flow and reports readiness for WooCommerce, WooCommerce Subscriptions, and Stripe classes.

## Setup

1. Activate WooCommerce and create digital/downloadable products.
2. Install WooCommerce Subscriptions and WooCommerce Memberships for recurring billing and entitlement management.
3. Install and configure the WooCommerce Stripe Gateway for test or live mode.
4. Activate `algq-revenue-systems`.
5. Open **WooCommerce → Algonquian Monetization** and map product IDs to subscription tiers, plugin licenses, digital products, education products, and services.
6. Add the public shortcodes to store, pricing, account, investor, education, service, or buyer-portal pages.

## Shortcodes

- `[algq_monetization_store]`
- `[algq_subscription_tiers]`
- `[algq_plugin_licensing]`
- `[algq_education_products]`
- `[algq_service_products]`
- `[algq_revenue_center]`
- `[algq_revenue_dashboard]`
- `[algq_customer_dashboard]`
- `[algq_protected_downloads]`
- `[algq_license_status]`

## REST API

Authenticated users can call `GET /wp-json/algq/v1/license/status` or `GET /wp-json/algq/v1/license` to retrieve active status, license key, tier, tier label, expiration date, activations, WooCommerce readiness, Subscriptions readiness, and Stripe readiness.

Administrators can issue or renew licenses with:

- `POST /wp-json/algq/v1/license`
- `POST /wp-json/algq/v1/license/{license}/renew`

License clients can activate a site with:

- `POST /wp-json/algq/v1/license/{license}/activate`

Authenticated users or administrators can deactivate with:

- `POST /wp-json/algq/v1/license/{license}/deactivate`

## Version 1.0 Launch Stack

Launch with Deal Intake, MAO Engine, Offer Generator, Buyer Portal, Command Center, Revenue Systems, and WooCommerce. The first products to sell are plugin licenses, template packs, investor tools, memberships, and courses so acquisition revenue, digital product revenue, subscription revenue, marketplace revenue, and software licensing revenue all flow through the same platform.
