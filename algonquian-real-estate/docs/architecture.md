# Architecture

The platform is organized as independent WordPress plugins so teams can ship, activate, and license modules separately while preserving shared naming conventions.

## Module boundaries

- **Deal Intake** owns seller/property lead capture and the canonical `wp_algq_deals` table.
- **MAO Engine** owns underwriting calculations and exposes an underwriter service class.
- **Offer Generator** owns seller-finance scenario UX, amortization schedules, legacy visualizations, and document generation placeholders.
- **Pipeline CRM** owns deal stage state and activity events.
- **Buyer Portal** owns buyer-facing profiles, NDA state, and deal interest signals.
- **Digital Products** owns WooCommerce-aware product-library presentation and access-control hooks.
- **Command Center** reads from module tables and WordPress/WooCommerce data for executive widgets.

## Integration conventions

- Tables use the `algq_` namespace after the WordPress table prefix.
- Shortcodes use `algq_*` names.
- Each plugin should be independently installable and avoid hard failures when optional companion plugins are inactive.
