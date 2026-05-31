# Algonquian Real Estate Plugin Platform

This directory contains the modular WordPress plugin architecture for the Algonquian Real Estate platform. Each plugin is intended to remain independently installable while sharing common naming, routing, capability, and documentation conventions.

## Plugin Catalog

| Plugin | Purpose | Status |
| --- | --- | --- |
| `algq-deal-intake` | Lead capture, validation, scoring, tagging, REST endpoints, and import/export workflows. | Production |
| `algq-pipeline-crm` | Kanban pipeline, activity history, assignment, and audit trail workflows. | Production |
| `algq-mao-engine` | Maximum Allowable Offer calculations, scenario storage, REST endpoints, and shortcodes. | Scaffolded |
| `algq-offer-generator` | LOI, purchase agreement, seller-financing, PDF, and merge-field workflows. | Production |
| `algq-buyer-portal` | Buyer onboarding, NDA gating, downloads, and interest submissions. | Production |
| `algq-funding-tracker` | Lenders, commitments, funding status, and deal-to-lender mapping. | Production |
| `algq-automation-engine` | Trigger/action automation, notifications, document triggers, and closeout workflows. | Production |
| `algq-pdf-signature` | PDF rendering, signature workflow, archive, and execution status. | Production |
| `algq-document-library` | Institutional document library by entity, lender, acquisition, financial, risk, and property categories. | Production |
| `algq-command-center` | KPI dashboard, pipeline value, deal counts, funding status, buyer activity, and reporting. | Production |
| `algq-digital-products` | WooCommerce licensing, subscriptions, download protection, and Stripe metadata. | Production |
| `algq-are-marketplace` | Wholesale deals, investor access, deal syndication, buyer subscriptions, and premium listings. | Production |

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
- Creative Offer Generator (`algq-offer-generator`) — purchase agreement, LOI, seller-financing, print/PDF, version history, and merge-field workflows.
- Pipeline CRM (`algq-pipeline-crm`) — Kanban stages, drag-and-drop movements, assignments, notes, activity logs, and audit history.
- Buyer Portal (`algq-buyer-portal`) — buyer registration profile, NDA acceptance, download permissions, deal package delivery, and interest submissions.
- Digital Product Store (`algq-digital-products`) — WooCommerce licensing, subscription tiers, protected downloads, and Stripe metadata.
- Funding Tracker (`algq-funding-tracker`) — lender database, commitments, funding status, deal mappings, and relationship touch logs.
- Automation Engine (`algq-automation-engine`) — trigger/action rules, status automations, notifications, document triggers, and closeout workflows.
- PDF & Signature (`algq-pdf-signature`) — PDF rendering, signature requests, document archive, and execution statuses.
- Document Library (`algq-document-library`) — entity, lender, acquisition, financial control, risk, and property management documents.
- Admin Command Center (`algq-command-center`) — KPI dashboard and reporting engine for deals, pipeline value, funding, buyer activity, and documents.
- ARE Marketplace (`algq-are-marketplace`) — wholesale listings, investor access, syndication, buyer subscriptions, and premium placements.

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
- `[algq_funding_tracker]`
- `[algq_automation_engine]`
- `[algq_document_archive]`
- `[algq_document_library]`
- `[algq_command_center]`
- `[algq_are_marketplace]`

## WPBakery usage

Use the Offer Generator shortcode inside a valid WPBakery text block wrapper:

```text
[vc_column_text]
[algq_offer_generator]
[/vc_column_text]
```

