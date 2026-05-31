# Algonquian Real Estate Plugin Platform

This directory contains the modular WordPress plugin architecture for the Algonquian Real Estate platform. Each plugin is intended to remain independently installable while sharing common naming, routing, capability, and documentation conventions.

## Plugin Catalog

| Plugin | Purpose | Status |
| --- | --- | --- |
| `algq-deal-intake` | Lead capture, validation, scoring, tagging, REST endpoints, and import/export workflows. | Scaffolded |
| `algq-pipeline-crm` | Kanban pipeline, activity history, assignment, and audit trail workflows. | Planned |
| `algq-mao-engine` | Maximum Allowable Offer calculations, scenario storage, REST endpoints, and shortcodes. | Scaffolded |
| `algq-offer-generator` | LOI, purchase agreement, seller-financing, PDF, and merge-field workflows. | Scaffolded |
| `algq-buyer-portal` | Buyer onboarding, NDA gating, downloads, and interest submissions. | Planned |
| `algq-funding-tracker` | Lenders, commitments, funding status, and deal-to-lender mapping. | Planned |
| `algq-automation-engine` | Trigger/action automation, notifications, document triggers, and closeout workflows. | Planned |
| `algq-pdf-signature` | PDF rendering, signature workflow, archive, and execution status. | Planned |
| `algq-document-library` | Institutional document library by entity, lender, acquisition, financial, risk, and property categories. | Planned |
| `algq-command-center` | KPI dashboard, pipeline value, deal counts, funding status, buyer activity, and reporting. | Planned |
| `algq-revenue-systems` | WooCommerce monetization for licensing, digital products, subscription tiers, protected downloads, and Stripe-ready checkout. | Scaffolded |

## Repository Areas

- `plugins/` — independently installable WordPress plugins.
- `docs/` — platform architecture, implementation notes, and module specifications.
- `wpbakery/` — page-builder snippets and layout exports.
- `assets/` — shared brand and platform assets.
- `licensing/` — licensing and productization materials.
- `deployment/` — packaging, release, and deployment runbooks.
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
- Revenue Systems (`algq-revenue-systems`) — WooCommerce product maps, subscription tiers, license status, protected downloads, and Stripe gateway readiness.

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
- `[algq_monetization_store]`
- `[algq_subscription_tiers]`
- `[algq_protected_downloads]`
- `[algq_license_status]`

## WPBakery usage

Use the Offer Generator shortcode inside a valid WPBakery text block wrapper:

```text
[vc_column_text]
[algq_offer_generator]
[/vc_column_text]
```

