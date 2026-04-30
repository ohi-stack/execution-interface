v0.2.2 - WooCommerce + mobile/contrast release

- Fixed parse error in `includes/class-shortcodes.php` and preserved all capital portal shortcodes, including disclosure acceptance handling.
- Confirmed WooCommerce capital-linked product handling remains registered and keyed by `_onegodian_capital_offering_id`.
- Confirmed admin and frontend notices for capital-linked products, comment/ping/review disabling hooks, and checkout-only guidance alignment.
- Polished public UI contrast and responsive overflow behavior for dashboard/card/table views and supporting standards docs.

v0.1.0 - Initial scaffold

- Created plugin bootstrap, activation/deactivation hooks, and uninstall file.
- Added core include classes, admin/public views, templates, docs, and test notes.

## 0.2.5 - Admin Control Layer
- Added Capital Portal operator admin console with Dashboard, Offerings, Disclosures, Certificates, Ledger, Investors, Readiness Checklist, and Settings sections.
- Added capability-mapped menu routing using plugin-specific capabilities for role-safe access.
- Added admin control-layer widgets and legal/compliance boundary notices across operator pages.
- Added responsive admin CSS for the new control-layer layout.
- Preserved legal-review boundary and kept live investment/payment workflows inactive pending readiness completion.
