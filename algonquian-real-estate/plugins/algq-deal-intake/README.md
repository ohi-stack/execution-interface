# Algonquian Deal Intake

Seller lead intake plugin for Algonquian Real Estate, LLC.

## Shortcodes

- `[algq_deal_intake_admin]`
- `[algq_sell_property_form]`
- `[algq_fsbo_contact_form]`
- `[algq_property_evaluation_form]`
- `[algq_seller_financing_inquiry]`
- `[algq_inherited_property_form]`
- `[algq_vacant_property_form]`

## UI upgrade notes

Version 1.1.0 upgrades the admin experience to the Algonquian Real Estate institutional dashboard standard:

- Branded ARE dashboard header using navy, gold, black, and white.
- Brand language: “Faith. Focus. Loyalty. Legacy.”
- KPI cards for New Leads, Reviewing, Converted, and Archived.
- Status badges for `algq-status-new`, `algq-status-reviewing`, `algq-status-converted`, and `algq-status-archived`.
- Empty-state panel for accounts with no leads.
- Admin actions for View, Edit, Convert to Pipeline, and Archive.
- Improved seller contact, property details, and deal context form sections.
- Responsive desktop, tablet, and mobile CSS.

## Security

Admin actions use WordPress nonces and capability checks. Inputs are sanitized before database writes, and dashboard output is escaped with WordPress escaping helpers.

## Packaging

The production ZIP package should contain the `algq-deal-intake` folder at the archive root.
