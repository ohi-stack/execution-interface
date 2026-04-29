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
