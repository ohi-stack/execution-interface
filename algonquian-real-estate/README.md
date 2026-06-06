# Algonquian Real Estate Plugin Platform

## Overview

Algonquian Real Estate is a modular WordPress plugin suite for real-estate acquisition, underwriting, creative offer generation, pipeline operations, buyer distribution, monetization, documentation, and executive reporting. The platform is organized as independently installable plugins so production sites can activate only the modules they need while sharing common `algq_` naming, capability, shortcode, REST, and deployment conventions.

Version 1.0 focuses on moving a lead from capture to monetization: a seller submits a deal, the team underwrites it, generates offers, advances the opportunity through the pipeline, gates buyer access, tracks funding and documents, and surfaces operating metrics in admin dashboards.

## Production Features

- Independent WordPress plugin modules for core services, deal intake, MAO underwriting, offer generation, pipeline CRM, buyer portal, marketplace distribution, revenue systems, product vault, affiliate tracking, funding, documents, PDF signature workflows, automation, and command-center reporting.
- Marketplace production hardening with an enterprise class loader, activation/deactivation tasks, generated page provisioning, settings registration, role capabilities, audit logging, NDA acceptance, buyer-interest handling, cache-backed integration checks, and public/admin UI polish.
- WooCommerce-aware revenue modules for monetization stores, subscription tiers, protected downloads, licensing status, customer dashboards, education products, service products, and plugin licensing.
- WordPress REST endpoints for module snapshots, pipeline records, deal intake, MAO calculations, marketplace status, and PDF-signature records.
- Packaging, deployment, architecture, cache, security, integration, and PHPUnit scaffold documentation for release readiness.

## Generated Pages

Activation workflows create or declare public pages when a WordPress environment is available:

| Page | Slug | Content |
| --- | --- | --- |
| Deal Marketplace | `deal-marketplace` | `[algq_marketplace]` |
| ARE Marketplace legacy declaration | `are-marketplace` | `[algq_marketplace]` |

The generated page flow avoids duplicate creation by storing the page ID in an option and reusing an existing page when the expected slug already exists.

## Shortcodes

| Shortcode | Module | Purpose |
| --- | --- | --- |
| `[algq_deal_intake]` | Deal Intake | Seller/property lead capture. |
| `[algq_mao_calculator]` | MAO Engine | Public underwriting calculator. |
| `[algq_offer_generator]` | Offer Generator | Creative-offer and seller-finance scenario UI. |
| `[algq_pipeline_board]` | Pipeline CRM | Kanban-style pipeline board. |
| `[algq_pipeline_crm]` | Pipeline CRM | Pipeline CRM board alias. |
| `[algq_buyer_portal]` | Buyer Portal | Buyer profile, NDA, downloads, and interest foundations. |
| `[algq_buyer_registration]` | Buyer Portal | Buyer onboarding form. |
| `[algq_marketplace]` | Marketplace | Buyer-facing deal marketplace. |
| `[algq_deal_marketplace]` | Marketplace | Marketplace alias for deal-distribution pages. |
| `[algq_product_library]` | Digital Products | WooCommerce-aware product library. |
| `[algq_plugin_library]` | Digital Products | Plugin catalog presentation. |
| `[algq_product_vault]` | Product Vault | Protected product and training asset catalog. |
| `[algq_affiliate_engine]` | Affiliate Engine | Referral partner and commission-event foundations. |
| `[algq_funding_tracker]` | Funding Tracker | Lender status and committed-capital snapshot. |
| `[algq_automation_engine]` | Automation Engine | Trigger/action automation foundation. |
| `[algq_document_library]` | Document Library | Institutional document categories and records. |
| `[algq_signature]` | PDF Signature | Signature request and execution workflow. |
| `[algq_monetization_store]` | Revenue Systems | Storefront for monetized offers. |
| `[algq_subscription_tiers]` | Revenue Systems | Recurring buyer or customer membership tiers. |
| `[algq_plugin_licensing]` | Revenue Systems | Plugin licensing offer surface. |
| `[algq_education_products]` | Revenue Systems | Education product catalog. |
| `[algq_service_products]` | Revenue Systems | Service product catalog. |
| `[algq_revenue_center]` | Revenue Systems | Revenue operating center. |
| `[algq_revenue_dashboard]` | Revenue Systems | Admin/customer revenue metrics presentation. |
| `[algq_customer_dashboard]` | Revenue Systems | Customer account dashboard. |
| `[algq_protected_downloads]` | Revenue Systems | Protected customer downloads. |
| `[algq_license_status]` | Revenue Systems | License state and entitlement display. |
| `[algq_command_center]` | Command Center | Executive operating hub. |

WPBakery usage example:

```text
[vc_column_text]
[algq_offer_generator]
[/vc_column_text]
```

## Admin Screens

- **Deal Marketplace** — top-level admin menu for marketplace settings and operating status, guarded by `algq_manage_deal_marketplace` or administrator access.
- **MAO Engine** — admin calculator for underwriting scenarios and saved calculations.
- **Pipeline CRM** — admin board, metrics, movement controls, assignment, and activity history.
- **PDF Signature** — document request, rendering, recipient, archive, and execution-status administration.
- **Command Center** — executive operating dashboard across acquisitions, underwriting, offers, pipeline, buyers, funding, marketplace, revenue, documents, automation, technology, compliance, and reporting.
- **Revenue Systems** — monetization, subscriptions, licensing, protected downloads, and customer-dashboard operations.
- **Document Library** — private document records, categories, revision metadata, and future PDF access-control foundations.

## Buyer Workflow

1. Capture or import seller/property leads through Deal Intake.
2. Underwrite the opportunity in the MAO Engine and generate creative-offer scenarios.
3. Move the deal through Pipeline CRM stages while preserving activity history.
4. Publish qualified opportunities to the Marketplace or Buyer Portal.
5. Gate access by role, subscription tier, buyer profile, and NDA state.
6. Collect buyer interest, downloads, and deal-room engagement signals.
7. Track funding, documents, signatures, and command-center KPIs through closeout.

## NDA Workflow

- Marketplace NDA acceptance records the listing ID, user ID, hashed IP address, and an audit-log event.
- Buyer-facing deal access can be paired with Buyer Portal profile state and marketplace view/interest capabilities.
- Administrators can review marketplace and buyer activity from protected admin surfaces before releasing sensitive documents.
- The flow is designed to support future signed-PDF, document-library, and subscription-entitlement integrations without exposing raw personal or network data in public output.

## Caching

- Marketplace production code uses a small cache layer with a dedicated `algq_deal_marketplace` object-cache group and `algq_dm_` key prefix.
- Cached values are written to both `wp_cache_*` and transients so sites with or without a persistent object cache receive performance benefits.
- Integration status is cached for short windows to avoid repeated plugin-availability checks in admin notices and REST payloads.
- The cache exposes targeted deletion and marketplace flush helpers for active listings and integration data.

## Capabilities

Marketplace activation installs the following capabilities:

| Capability | Intended use |
| --- | --- |
| `algq_manage_deal_marketplace` | Manage marketplace admin settings and status. |
| `algq_view_deal_marketplace` | View gated marketplace inventory. |
| `algq_submit_deal_interest` | Submit buyer interest. |
| `algq_manage_deal_ndas` | Manage NDA-related deal access workflows. |

Administrators receive all marketplace capabilities. Subscribers receive marketplace view and interest-submission capabilities for buyer-facing flows. Module-specific screens also continue to use WordPress administrator checks where appropriate.

## Security

- Direct file access is blocked with `ABSPATH` guards across plugin entrypoints and classes.
- Admin screens and state-changing workflows use WordPress capabilities, nonce checks, sanitized settings, and escaped output.
- Marketplace security helpers centralize text, email, allowed-value, nonce, and capability checks.
- NDA logging stores a hashed IP instead of the raw address.
- PHPUnit shim tests intentionally avoid production database and network access; full WordPress test runs should use disposable local or staging data only.

## Integrations

- **ARE suite modules:** Deal Intake, Pipeline CRM, Buyer Portal, Digital Products, Document Library, Command Center, Funding Tracker, Automation Engine, PDF Signature, Product Vault, Affiliate Engine, and Marketplace can run independently while exposing shared workflows.
- **WooCommerce:** Revenue Systems and Digital Products are WooCommerce-aware for subscriptions, protected downloads, product mapping, customer dashboards, licensing, and Stripe-ready checkout foundations.
- **WordPress REST:** Modules publish REST endpoints under Algonquian namespaces for marketplace status, pipeline activity, intake, MAO calculations, and signature workflows.
- **WPBakery:** Shortcodes can be embedded inside builder text blocks for public landing pages and internal dashboards.
- **Optional plugin detection:** Marketplace integration checks detect companion plugins by class, function, or active plugin file and cache the result.

## Testing

Run validation from the repository root unless noted otherwise:

```bash
find algonquian-real-estate/plugins -name '*.php' -print0 | xargs -0 -n1 php -l
bash algonquian-real-estate/scripts/build-plugin-zips.sh
```

Marketplace includes a PHPUnit scaffold at `plugins/algq-marketplace/phpunit.xml.dist` with lightweight WordPress shims for safe local checks:

```bash
cd algonquian-real-estate/plugins/algq-marketplace
phpunit -c phpunit.xml.dist
```

The marketplace suite verifies plugin loading, constants, activation classes, shortcode registration, generated page definitions, capabilities, and sanitization helpers. Use the official WordPress test suite with disposable data for full database, role-persistence, REST dispatch, and page-creation coverage.

## Deployment

1. Confirm plugin PHP linting and marketplace PHPUnit checks pass.
2. Build release ZIP archives with `algonquian-real-estate/scripts/build-plugin-zips.sh`.
3. Review architecture, deployment, cache, security, integration, and module README documentation before tagging.
4. Deploy to staging first, activate modules in dependency order, and verify generated pages, shortcodes, admin menus, REST responses, buyer workflows, NDA recording, cache behavior, and WooCommerce-dependent surfaces.
5. Back up production data, deploy ZIPs, flush rewrite rules/object caches, and smoke-test public and admin workflows.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history. The latest production-hardening entry is `1.0.1-production-hardening`.

## Plugin Catalog

| Plugin | Purpose | Status |
| --- | --- | --- |
| `algq-core` | Shared roles, permissions, database tables, REST namespace, settings, activity logging, notifications, licensing, UI primitives, and integration registry. | Scaffolded |
| `algq-deal-intake` | Lead capture, validation, scoring, tagging, REST endpoints, and import/export workflows. | Scaffolded |
| `algq-pipeline-crm` | Kanban pipeline, activity history, assignment, REST movement endpoints, and audit trail workflows. | Implemented |
| `algq-mao-engine` | Maximum Allowable Offer calculations, scenario storage, REST endpoints, and shortcodes. | Scaffolded |
| `algq-command-center` | Executive operating hub for acquisitions, underwriting, offers, pipeline, buyers, funding, marketplace, revenue, documents, automation, technology, compliance, and reporting. | Scaffolded |
| `algq-offer-generator` | LOI, purchase agreement, seller-financing, PDF, and merge-field workflows. | Scaffolded |
| `algq-document-library` | Institutional document library by entity, lender, acquisition, financial, risk, and property categories. | Scaffolded |
| `algq-pdf-signature` | PDF rendering, signature workflow, archive, and execution status. | Scaffolded |
| `algq-automation-engine` | Trigger/action automation, notifications, document triggers, and closeout workflows. | Scaffolded |
| `algq-buyer-portal` | Buyer onboarding, NDA gating, downloads, and interest submissions. | Scaffolded |
| `algq-funding-tracker` | Lenders, commitments, funding status, and deal-to-lender mapping. | Scaffolded |
| `algq-marketplace` | Wholesale deals, investor access, deal syndication, buyer subscriptions, premium listings, production hardening, and PHPUnit scaffold. | Hardened |
| `algq-revenue-systems` | WooCommerce monetization for licensing, digital products, subscription tiers, protected downloads, and Stripe-ready checkout. | Scaffolded |
| `algq-product-vault` | Protected digital products, WooCommerce product mapping, license-gated downloads, and training asset access. | Scaffolded |
| `algq-affiliate-engine` | Referral partner attribution, commission-event readiness, and payout export foundations. | Scaffolded |

## Repository Layout

```text
algonquian-real-estate/
├── plugins/     # WordPress plugins, one module per directory
│   ├── algq-core
│   ├── algq-deal-intake
│   ├── algq-pipeline-crm
│   ├── algq-mao-engine
│   ├── algq-offer-generator
│   ├── algq-buyer-portal
│   ├── algq-funding-tracker
│   ├── algq-automation-engine
│   ├── algq-pdf-signature
│   ├── algq-document-library
│   ├── algq-command-center
│   ├── algq-revenue-systems
│   ├── algq-product-vault
│   ├── algq-affiliate-engine
│   └── algq-marketplace
├── docs/        # Architecture and implementation documentation
├── wpbakery/    # Page-builder snippets, shortcode wrappers, and layout exports
├── assets/      # Shared images, screenshots, and static assets
├── licensing/   # Licensing, entitlement, and productization materials
├── deployment/  # Packaging, release, hosting, and deployment runbooks
└── tests/       # Test planning and validation notes
```

## REST Endpoint Summary



## Deal Marketplace 1.0.1 production package

The Algonquian Deal Marketplace plugin is packaged for production as `algq-deal-marketplace-1.0.1-production.zip`, but ZIP artifacts are generated locally and intentionally not committed so binary package files do not block branch pushes. This release validates PHP syntax across the ARE PHP tree, the plugin smoke-test path when PHPUnit is available, WordPress activation expectations, generated pages, shortcodes, admin menu registration, buyer interest submission, NDA gate copy, cache clearing, optional plugin inactivity, and non-destructive uninstall defaults. Detailed validation steps and the package command are documented in `docs/deal-marketplace-validation.md`.
- Pipeline CRM exposes `/wp-json/algq/v1/pipeline/deals`, `/wp-json/algq/v1/pipeline/deals/{id}`, `/wp-json/algq/v1/pipeline/deals/{id}/stage`, `/wp-json/algq/v1/pipeline/activity`, and `/wp-json/algq/v1/pipeline/metrics` for deal listing, detail, stage movement, activity, and metrics workflows.
- Marketplace exposes `/wp-json/algq/v1/marketplace` for marketplace module and integration status.
- MAO Engine exposes `/wp-json/algq-mao/v1` routes for calculations and saved underwriting scenarios.
