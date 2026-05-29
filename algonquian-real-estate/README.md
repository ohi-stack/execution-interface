# Algonquian Real Estate

Algonquian Real Estate is a modular WordPress plugin suite for deal intake, underwriting, creative offers, pipeline CRM, buyer distribution, digital product revenue, and executive reporting.

## MVP modules

Version 1.0 targets the modules that move a lead from capture to monetization:

- Deal Intake (`algq-deal-intake`) — seller/property capture, deal IDs, notifications, and admin review.
- MAO Engine (`algq-mao-engine`) — ARV, rehab, assignment fee, max allowable offer, spread, and risk score.
- Creative Offer Generator (`algq-offer-generator`) — seller-finance offer UI, amortization, legacy visualization, and document placeholders.
- Pipeline CRM (`algq-pipeline-crm`) — Kanban stages and activity logging.
- Buyer Portal (`algq-buyer-portal`) — buyer registration profile, NDA acceptance, downloads, and interest tracking foundations.
- Digital Product Store (`algq-digital-products`) — WooCommerce-aware product library shortcode and gated download foundations.
- Admin Command Center (`algq-command-center`) — dashboard widgets for operating metrics.

## Repository layout

```text
algonquian-real-estate/
├── assets/      # Shared images, screenshots, and static assets
├── docs/        # Architecture and implementation documentation
├── plugins/     # WordPress plugins, one module per directory
├── roadmap/     # Epic/task backlog and release plans
├── scripts/     # Build and maintenance scripts
├── templates/   # Shared template snippets
└── tests/       # Test scaffolding and fixtures
```

## Local validation

From the repository root:

```bash
find algonquian-real-estate/plugins -name '*.php' -print0 | xargs -0 -n1 php -l
bash algonquian-real-estate/scripts/build-plugin-zips.sh
```

## Shortcodes

- `[algq_deal_intake]`
- `[algq_mao_engine]`
- `[algq_offer_generator]`
- `[algq_pipeline_crm]`
- `[algq_buyer_portal]`
- `[algq_product_library]`
