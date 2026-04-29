# ONEGODIAN Capital Portal (Private Plugin)

## Purpose
Standalone WordPress plugin for digital capital instrument records (notes, bonds), offerings, investor ledgers, disclosures, and verifiable certificates.

## Private Repo Warning
This plugin is intended for private repository use only. Do not publish source, investor records, or legal documents publicly.

## Installation
1. Copy plugin folder to `wp-content/plugins/onegodian-capital-plugin`.
2. Activate **ONEGODIAN Capital Portal** in WordPress admin.
3. Configure settings under the Capital Portal settings screen.

## Shortcodes
- `[onegodian_capital_offerings]`
- `[onegodian_capital_offering id="123"]`
- `[onegodian_investor_dashboard]`
- `[onegodian_capital_certificate id="CERT-ID"]`
- `[onegodian_capital_disclosure id="DISC-ID"]`

## Data Model
- CPT: `onegodian_offering`
- Meta fields: instrument type, lifecycle status, purchase ranges, raise targets, dates, terms, use-of-funds, disclosure packet version.
- Tables: instruments, ledger, disclosure acceptances, certificates.

## Legal Review Warning
The ONEGODIAN Capital Portal is software infrastructure for managing digital records related to private capital instruments. It does not itself create, approve, or validate any securities offering. All notes, bonds, repayment terms, investor eligibility rules, disclosures, exemptions, and offering documents must be reviewed by qualified legal counsel before public use.

## Version Roadmap
- v0.1.0: Initial scaffold.
- v0.2.0: Purchase flow integration (order -> disclosure acceptance -> instrument -> ledger -> certificate -> dashboard).

## UI Layer (v0.2.1)
- Adds public and admin interface styling for institutional portal presentation.
- Public shortcodes render structured sections for offerings, offering detail, investor dashboard, certificates, and disclosure consent.
- Investor dashboard sections include My Capital Instruments, Certificates, Disclosure Acceptances, Ledger History, and Account Notices.
- Purchase processing remains a scaffold in this release and stays disclosure-first; production public offering use still requires legal review.


## Shortcode UI Sections
- `onegodian_capital_offerings`: offering cards with status and disclosure packet metadata.
- `onegodian_capital_offering`: overview, terms, use-of-funds, disclosure and legal notice, CTA placeholder.
- `onegodian_investor_dashboard`: instruments, certificates, disclosures, ledger history, and account notices.
- `onegodian_capital_certificate`: certificate metadata and verification placeholders.
- `onegodian_capital_disclosure`: disclosure consent state table.

## v0.2.0 Purchase Flow Scaffold
- WooCommerce integration is optional for plugin activation, but required for paid-order issuance flow.
- Disclosure acceptance must be recorded before an instrument can be issued from a paid order.
- Paid WooCommerce order items linked with `_onegodian_capital_offering_id` can create instrument, ledger, and certificate records.
- Issuance records are bookkeeping artifacts; legal review remains required before any public offering use.

## WooCommerce Product Handling (Capital-Linked)
- Products with `_onegodian_capital_offering_id` are treated as checkout-only items, not ordinary retail catalog listings.
- Capital-linked product pages display a frontend notice directing buyers to official offering and disclosure pages before checkout.
- Product edit screens display an admin warning clarifying Capital Portal-first presentation requirements.
- Capital-linked products have comments/reviews disabled where possible through plugin hooks.
- Recommended standards and implementation guidance are documented in `docs/WOOCOMMERCE_PRODUCT_STANDARD.md`.
