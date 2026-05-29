# Algonquian Real Estate Backlog

## Epic 1 — Repository Foundation

- **ARE-001**: Create repository structure: `docs/`, `plugins/`, `templates/`, `roadmap/`, `assets/`, `tests/`, and `scripts/`.
- **ARE-002**: Create `README.md`, `LICENSE`, `CHANGELOG.md`, and `CONTRIBUTING.md`.
- **ARE-003**: Create GitHub Actions workflows: `wordpress-lint.yml`, `phpcs.yml`, and `build-plugin-zips.yml`.

## Epic 2 — Deal Intake Plugin

- **ARE-010**: Build seller lead form, property form, deal ID generation, admin dashboard, and `wp_algq_deals`.
- **ARE-011**: Build `[algq_deal_intake]` with validation, spam protection, and email notifications.

## Epic 3 — MAO Engine

- **ARE-020**: Build `[algq_mao_engine]` with ARV, rehab estimate, assignment fee, and MAO calculator.
- **ARE-021**: Create `class-underwriter.php` returning MAO, profit spread, and risk score.

## Epic 4 — Creative Offer Generator

- **ARE-030**: Create `algq-offer-generator` UI assets and template.
- **ARE-031**: Build amortization engine for payment, seller total income, and schedules.
- **ARE-032**: Build Legacy Visualizer outputs for monthly income, lifetime income, and timeline.
- **ARE-033**: Generate offer summary, LOI, seller financing sheet, and payment schedule PDFs.

## Epic 5 — Pipeline CRM

- **ARE-040**: Build Kanban board with Lead Captured, Underwriting, Offer Sent, Under Contract, Buyer Assigned, and Closed stages.
- **ARE-041**: Enable drag-and-drop stage movement.
- **ARE-042**: Create activity logging in `wp_algq_activity_log`.

## Epic 6 — Buyer Portal

- **ARE-050**: Build registration, login, NDA acceptance, and deal downloads.
- **ARE-051**: Build buyer profiles for markets, cash available, buy box, and property types.
- **ARE-052**: Build interest tracking: Interested, Requested Call, Offer Submitted, Assigned.

## Epic 7 — Digital Product Store

- **ARE-060**: Create digital products for contract packs, spreadsheets, calculators, checklists, and training.
- **ARE-061**: Integrate WooCommerce secure downloads, license tracking, and access control.
- **ARE-062**: Build `[algq_product_library]` dashboard.

## Epic 8 — Document Library

- **ARE-070**: Build document categories, versioning, search, and tagging.
- **ARE-071**: Build PDF storage manager.

## Epic 9 — PDF & Signature

- **ARE-080**: Build PDF generation, signature requests, and audit logs.
- **ARE-081**: Generate Purchase Agreement, LOI, Assignment Contract, and Seller Financing Agreement.

## Epic 10 — Automation Engine

- **ARE-090**: Build workflow builder for lead-to-offer automations.
- **ARE-091**: Build email automation templates.

## Epic 11 — Funding Tracker

- **ARE-100**: Track lenders, loan requests, commitments, and funding status.

## Epic 12 — Admin Command Center

- **ARE-110**: Create widgets for active deals, pipeline value, offers sent, buyer activity, and funding status.
- **ARE-111**: Build executive dashboard charts.

## Epic 13 — Revenue Systems

- **ARE-120**: Build subscription tiers: Investor, Buyer, Pro, Enterprise.
- **ARE-121**: Build recurring billing with WooCommerce Subscriptions and Stripe.
- **ARE-122**: Create SaaS licensing for Single Site, Agency, and Enterprise.
