# Algonquian Core

Shared platform plugin for the Algonquian Real Estate software suite.

## Responsibilities

- Roles and permissions for acquisition, disposition, funding, administration, investor, buyer, seller, and contractor workflows.
- Shared database tables: `algq_activity_log`, `algq_notifications`, `algq_settings`, `algq_integrations`, and `algq_licenses`.
- Shared REST namespace: `/wp-json/algq/v1/`.
- Settings, activity logging, notifications, licensing, shared admin UI primitives, and integration registry services.
- Integration slots for WooCommerce, Stripe, PayPal, FluentCRM, WP Mail SMTP, Google Maps, and OpenAI APIs.

All Algonquian feature modules should declare `Requires Plugins: algq-core` and boot only after `algq_core()` is available.
