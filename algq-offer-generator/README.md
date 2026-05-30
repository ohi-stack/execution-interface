# Algonquian Offer Generator

The Algonquian Offer Generator is a WordPress shortcode module for creating seller-facing offer previews from structured acquisition terms. It supports creative finance scenarios, document merge-field review, and printable summaries for internal or WPBakery-hosted deal pages.

## Shortcode

```text
[algq_offer_generator]
```

## Purpose

Use the Offer Generator to:

- Enter property, seller, buyer, and proposed financing terms.
- Calculate financed amount, estimated monthly payment, total seller income, and total interest.
- Preview key merge fields before generating or copying terms into deal documents.
- Print or save the offer summary as a PDF from the browser.

## Supported documents

The current interface supports these document workflows:

- Letter of Intent
- Purchase Agreement
- Seller Financing Term Sheet
- Assignment Summary

## Merge fields

The shortcode interface previews these merge fields for downstream document assembly:

| Merge field | Description |
| --- | --- |
| `{{seller_name}}` | Seller or authorized representative name. |
| `{{buyer_entity}}` | Buyer entity, acquisition entity, or assignee. |
| `{{property_address}}` | Subject property address. |
| `{{closing_date}}` | Target closing date or `TBD`. |
| `{{purchase_price}}` | Proposed purchase price. |
| `{{down_payment}}` | Proposed down payment. |
| `{{financed_amount}}` | Purchase price less down payment. |
| `{{annual_rate}}` | Annual interest rate. |
| `{{term_months}}` | Financing term in months. |
| `{{monthly_payment}}` | Estimated monthly payment. |
| `{{seller_total_income}}` | Down payment plus estimated installment payments. |

## Admin usage

1. Install or copy `algq-offer-generator/plugin/` into the WordPress plugins directory.
2. Activate **Algonquian Offer Generator** in WordPress Admin → Plugins.
3. Add `[algq_offer_generator]` to a page, post, or protected deal workspace.
4. Publish the page and use the form to generate a seller-facing offer preview.

## WPBakery usage

Add the shortcode inside a WPBakery Text Block or Raw HTML-safe content area. Use valid WPBakery wrapper tags only:

```text
[vc_column_text]
[algq_offer_generator]
[/vc_column_text]
```

Use the closing shortcode shown above so the Text Block wrapper remains valid.
