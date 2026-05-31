# Algonquian Offer Generator

Production offer module for deal-specific purchase agreement, LOI, and seller-financing workflows.

## Features

- `[algq_offer_generator]` shortcode and admin page.
- Purchase Agreement, Letter of Intent, and Seller-Financing Offer templates.
- Deal merge fields for seller, buyer entity, property address, price, contingencies, closing date, down payment, rate, and term.
- Seller-financing amortization outputs for monthly payment, total seller income, and payment timeline.
- Print/save-PDF workflow using browser PDF rendering.
- Version history stored in `algq_offer_versions`.
- REST endpoints under `/wp-json/algq/v1/offers` for listing and creating offer versions.

## WPBakery usage

```text
[vc_column_text]
[algq_offer_generator]
[/vc_column_text]
```
