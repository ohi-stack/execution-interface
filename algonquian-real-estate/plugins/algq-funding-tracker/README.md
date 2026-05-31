# Algonquian Funding Tracker

Production funding module for lender relationship management and deal capital tracking.

## Features

- Lender database in `algq_lenders` with type, markets, contact, loan range, and relationship status.
- Capital commitments in `algq_capital_commitments` with committed/available amounts and terms.
- Funding status workflow: Sourcing, Term Sheet, Committed, Funded, Declined, Closed.
- Deal-to-lender mapping in `algq_deal_lender_map`.
- Relationship management touch log in `algq_lender_relationships`.
- `[algq_funding_tracker]` internal dashboard and REST endpoints under `/wp-json/algq/v1/funding/*`.
