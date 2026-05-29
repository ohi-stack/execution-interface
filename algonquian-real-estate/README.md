# Algonquian Real Estate Plugin Platform

This directory contains the modular WordPress plugin architecture for the Algonquian Real Estate platform. Each plugin is intended to remain independently installable while sharing common naming, routing, capability, and documentation conventions.

## Plugin Catalog

| Plugin | Purpose | Status |
| --- | --- | --- |
| `algq-deal-intake` | Lead capture, validation, scoring, tagging, and import/export workflows. | Planned |
| `algq-pipeline-crm` | Kanban pipeline, activity history, assignment, and audit trail workflows. | Planned |
| `algq-mao-engine` | Maximum Allowable Offer calculations, scenario storage, REST endpoints, and shortcodes. | Scaffolded |
| `algq-offer-generator` | LOI, purchase agreement, seller-financing, PDF, and merge-field workflows. | Planned |
| `algq-buyer-portal` | Buyer onboarding, NDA gating, downloads, and interest submissions. | Planned |
| `algq-funding-tracker` | Lenders, commitments, funding status, and deal-to-lender mapping. | Planned |
| `algq-automation-engine` | Trigger/action automation, notifications, document triggers, and closeout workflows. | Planned |
| `algq-pdf-signature` | PDF rendering, signature workflow, archive, and execution status. | Planned |
| `algq-document-library` | Institutional document library by entity, lender, acquisition, financial, risk, and property categories. | Planned |
| `algq-command-center` | KPI dashboard, pipeline value, deal counts, funding status, buyer activity, and reporting. | Planned |

## Repository Areas

- `plugins/` — independently installable WordPress plugins.
- `docs/` — platform architecture, implementation notes, and module specifications.
- `wpbakery/` — page-builder snippets and layout exports.
- `assets/` — shared brand and platform assets.
- `licensing/` — licensing and productization materials.
- `deployment/` — packaging, release, and deployment runbooks.
