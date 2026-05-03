# Purchase Flow Standard (v0.2.0 Scaffold)

## Scope
This document defines infrastructure-only purchase flow behavior for the ONEGODIAN Capital Portal Plugin.

## Mandatory Issuance Conditions
1. Disclosure acceptance must be recorded before issuance.
2. A paid WooCommerce order must exist before issuance.
3. Issuance creates recordkeeping artifacts only (instrument, ledger, certificate).

## Recordkeeping Artifacts
- Instrument records are generated after validated disclosure acceptance and paid order checks.
- Ledger purchase entries are generated from paid order item totals and order currency.
- Certificate records are generated with verification hashes and placeholder `pdf_url = null`.

## Legal Boundary
This scaffold is not legal approval to offer securities. Qualified legal review is required before public offering use.
