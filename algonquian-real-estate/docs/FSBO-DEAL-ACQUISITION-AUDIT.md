# Algonquian Real Estate FSBO Deal Acquisition Audit

Audit date: 2026-06-12  
Repository reviewed: `ohi-stack/execution-interface`  
Audited path: `/workspace/execution-interface`

## Executive summary

The current repository does **not** contain a dedicated Algonquian Real Estate website or a complete FSBO deal acquisition workflow. The codebase currently presents a OneGodian App/ACC-style Next.js interface with generic app, member, contributor, docs, tools, dashboard, and API status routes. No Algonquian Real Estate seller acquisition pages, real-estate-specific intake forms, FSBO shortcodes, or plugin bridge connections were found.

**FSBO deal acquisition support:** Not production-ready / not currently supported.

## Audit methodology

The repository was audited with file discovery and targeted text search for the requested FSBO, seller, property, shortcode, plugin, CRM, offer, document, buyer, funding, and command-center concepts.

Commands used:

```bash
find . -path ./node_modules -prune -o -path ./.git -prune -o -type f -print | sort
rg -n "Algonquian|Real Estate|FSBO|sell your property|seller financing|inherited|vacant|Deal Intake|Pipeline|Offer Generator|Document Library|Buyer Portal|Funding Tracker|Command Center|shortcode|contact" -S .
```

## Existing files found

### Repository/application files found

The existing application is a Next.js project with the following relevant files and routes:

| Area | Existing file(s) | Notes |
| --- | --- | --- |
| App shell and routes | `src/app/page.tsx`, `src/app/layout.tsx`, `src/components/AppShell.tsx` | Generic OneGodian app shell, not real estate seller acquisition. |
| Documentation route | `src/app/docs/page.tsx` | Displays current OneGodian plugin bridge shortcodes. No FSBO deal acquisition shortcodes. |
| Tools route | `src/app/tools/page.tsx` | Generic tools page, not seller intake tooling. |
| Dashboard/status routes | `src/app/dashboard/page.tsx`, `src/app/status/page.tsx` | Generic operational/app dashboard surfaces. |
| API status/read-model routes | `src/app/api/health/route.ts`, `src/app/api/manifest/route.ts`, `src/app/api/readiness/route.ts`, `src/app/api/version/route.ts`, `src/app/api/stats/route.ts`, `src/app/api/tasks/route.ts`, `src/app/api/tools/route.ts`, `src/app/api/workflows/route.ts`, `src/app/api/audit/route.ts`, `src/app/api/agents/route.ts` | No property intake, seller lead, CRM pipeline, offer generation, document library, buyer portal, funding tracker, or reporting endpoints were found. |
| Central content registry | `src/lib/acc-content.ts` | Defines OneGodian app positioning, routes, domain roles, dashboard modules, and current shortcodes. No Algonquian Real Estate or FSBO definitions. |
| Public metadata | `public/manifest.json`, `public/sitemap.xml`, `src/app/robots.ts` | Existing public metadata does not declare FSBO seller acquisition pages. |
| Audit output created | `algonquian-real-estate/docs/FSBO-DEAL-ACQUISITION-AUDIT.md` | This audit document. |

### FSBO-specific files found

No files were found for:

- `algonquian-real-estate/app/...`
- `algonquian-real-estate/pages/...`
- `algonquian-real-estate/components/...`
- `algonquian-real-estate/plugins/...`
- `algonquian-real-estate/wp-content/plugins/...`
- Real-estate seller lead capture routes
- FSBO acquisition plugin adapters
- Property intake API endpoints
- CRM pipeline integrations
- Offer generator integrations
- Buyer portal integrations
- Funding tracker integrations

## Requested capability checklist

| # | Requested item | Status | Evidence / notes |
| ---: | --- | --- | --- |
| 1 | Sell Your Property landing page | Missing | No route, page, or content matching `sell your property`, seller lead capture, or property sale CTA was found. |
| 2 | FSBO seller page | Missing | No `FSBO` route, content file, shortcode, or component was found. |
| 3 | Seller financing page | Missing | No seller-financing route, content file, shortcode, or component was found. |
| 4 | Inherited property page | Missing | No inherited-property acquisition page was found. |
| 5 | Vacant property page | Missing | No vacant-property acquisition page was found. |
| 6 | Contact/intake form | Missing | No property/seller intake form component, endpoint, or shortcode was found. |
| 7 | Deal Intake plugin connection | Missing | No Deal Intake shortcode, adapter, API route, or plugin bridge entry was found. |
| 8 | Pipeline CRM connection | Missing | No seller/deal pipeline CRM adapter, webhook, API route, or shortcode was found. |
| 9 | Offer Generator connection | Missing | No offer generator adapter, shortcode, API route, or UI route was found. |
| 10 | Document Library connection | Missing | No seller/deal document library adapter, shortcode, API route, or UI route was found. |
| 11 | Buyer Portal connection | Missing | No buyer portal adapter, shortcode, API route, or UI route was found. |
| 12 | Funding Tracker connection | Missing | No funding tracker adapter, shortcode, API route, or UI route was found. |
| 13 | Command Center reporting connection | Missing | Generic audit/dashboard routes exist, but no Algonquian Real Estate command-center reporting connection was found. |

## Missing pages

The following public acquisition pages should be created before the platform can support FSBO deal acquisition:

1. `/sell-your-property`
   - Primary seller acquisition landing page.
   - Should explain purchase criteria, trust signals, timeline, intake CTA, and expected process.
2. `/sell-your-property/fsbo`
   - Dedicated FSBO seller page.
   - Should target owners currently selling without an agent and include copy for direct-to-owner conversations.
3. `/sell-your-property/seller-financing`
   - Seller financing page.
   - Should explain owner-finance structures, qualification questions, and compliance disclaimers.
4. `/sell-your-property/inherited-property`
   - Inherited property page.
   - Should address probate, multiple heirs, as-is sales, timeline constraints, and document needs.
5. `/sell-your-property/vacant-property`
   - Vacant property page.
   - Should address holding costs, maintenance burden, liens/taxes, vandalism risk, and fast-close options.
6. `/contact` or `/sell-your-property/contact`
   - General contact page with seller routing.
7. `/sell-your-property/intake`
   - Multi-step or embedded intake form that routes to the Deal Intake plugin.

## Missing plugin connections

The current codebase does not show the requested real-estate acquisition plugin bridge. The following connections are required:

| Connection | Required purpose | Current status |
| --- | --- | --- |
| Deal Intake | Capture seller identity, property address, occupancy, asking price, mortgage/liens, timeline, repairs, photos, and consent. | Missing |
| Pipeline CRM | Convert submitted seller leads into deal records, stages, tasks, follow-ups, and owner assignments. | Missing |
| Offer Generator | Calculate and return offer ranges, cash/terms scenarios, repair assumptions, and approval status. | Missing |
| Document Library | Store seller disclosures, photos, contracts, title/probate docs, repair estimates, and offer PDFs. | Missing |
| Buyer Portal | Expose approved deals to buyers/investors after internal acquisition review. | Missing |
| Funding Tracker | Track proof-of-funds, earnest money, lender/private capital status, draw requests, and closing readiness. | Missing |
| Command Center reporting | Report acquisition funnel volume, source attribution, conversion, offers made, contracts signed, pipeline value, funding status, and closed deals. | Missing |

## Required shortcodes

If the Algonquian Real Estate stack is bridged through WordPress or a shortcode-rendered plugin layer, the following shortcodes should be added to the canonical shortcode registry and rendered on the corresponding pages.

| Shortcode | Intended page/placement | Purpose |
| --- | --- | --- |
| `[algonquian_sell_property_cta]` | `/sell-your-property` hero and repeated CTA sections | Launches seller intake or contact flow. |
| `[algonquian_fsbo_seller_page]` | `/sell-your-property/fsbo` | Renders FSBO-specific seller content and CTA. |
| `[algonquian_seller_financing_page]` | `/sell-your-property/seller-financing` | Renders seller-financing education, qualification prompts, and CTA. |
| `[algonquian_inherited_property_page]` | `/sell-your-property/inherited-property` | Renders inherited-property seller content and CTA. |
| `[algonquian_vacant_property_page]` | `/sell-your-property/vacant-property` | Renders vacant-property seller content and CTA. |
| `[algonquian_seller_contact_form]` | `/contact` or `/sell-your-property/contact` | General seller contact form. |
| `[algonquian_deal_intake_form]` | `/sell-your-property/intake` and CTA embeds | Full property/deal intake form. |
| `[algonquian_deal_pipeline_crm]` | Internal acquisition dashboard | Displays lead/deal stage, tasks, assignments, and follow-up status. |
| `[algonquian_offer_generator]` | Internal acquisition dashboard and approved seller views | Generates cash, terms, and seller-finance offer scenarios. |
| `[algonquian_document_library]` | Internal deal workspace and seller/buyer document views | Manages uploaded and generated deal documents. |
| `[algonquian_buyer_portal]` | Buyer-facing portal | Displays approved deals to buyers/investors. |
| `[algonquian_funding_tracker]` | Internal capital/closing dashboard | Tracks funding status and closing readiness. |
| `[algonquian_command_center_reporting]` | Command center dashboard | Reports funnel, pipeline, funding, and closing metrics. |

## Recommended folder structure

Recommended Next.js-first structure:

```text
algonquian-real-estate/
  docs/
    FSBO-DEAL-ACQUISITION-AUDIT.md
    FSBO-DEAL-ACQUISITION-BUILD-SPEC.md
  src/
    app/
      sell-your-property/
        page.tsx
        fsbo/page.tsx
        seller-financing/page.tsx
        inherited-property/page.tsx
        vacant-property/page.tsx
        intake/page.tsx
      contact/page.tsx
      command-center/
        acquisitions/page.tsx
        reporting/page.tsx
      buyer-portal/page.tsx
      api/
        deal-intake/route.ts
        pipeline-crm/route.ts
        offer-generator/route.ts
        document-library/route.ts
        buyer-portal/route.ts
        funding-tracker/route.ts
        command-center/reports/route.ts
    components/
      real-estate/
        SellerHero.tsx
        SellerIntakeForm.tsx
        PropertyTypeCards.tsx
        OfferProcess.tsx
        TrustSignals.tsx
        ShortcodeBridge.tsx
    lib/
      algonquian-content.ts
      real-estate-shortcodes.ts
      integrations/
        deal-intake.ts
        pipeline-crm.ts
        offer-generator.ts
        document-library.ts
        buyer-portal.ts
        funding-tracker.ts
        command-center-reporting.ts
    plugins/
      deal-intake/
      pipeline-crm/
      offer-generator/
      document-library/
      buyer-portal/
      funding-tracker/
      command-center-reporting/
```

If this is ultimately a WordPress-first implementation, mirror the same domains inside a plugin package:

```text
algonquian-real-estate/
  wp-content/
    plugins/
      algonquian-deal-acquisition/
        algonquian-deal-acquisition.php
        includes/
          shortcodes.php
          deal-intake.php
          pipeline-crm.php
          offer-generator.php
          document-library.php
          buyer-portal.php
          funding-tracker.php
          command-center-reporting.php
        templates/
          sell-your-property.php
          fsbo.php
          seller-financing.php
          inherited-property.php
          vacant-property.php
          intake-form.php
```

## Build checklist

### Phase 1: Public seller acquisition pages

- [ ] Create Algonquian Real Estate brand/content registry.
- [ ] Create `/sell-your-property` landing page.
- [ ] Create `/sell-your-property/fsbo` page.
- [ ] Create `/sell-your-property/seller-financing` page.
- [ ] Create `/sell-your-property/inherited-property` page.
- [ ] Create `/sell-your-property/vacant-property` page.
- [ ] Create `/contact` or `/sell-your-property/contact` page.
- [ ] Add metadata, sitemap entries, and noindex/index decisions for public pages.
- [ ] Add legal/compliance disclaimers for offers, seller financing, privacy, consent, and no-guarantee language.

### Phase 2: Intake and lead capture

- [ ] Build seller intake schema.
- [ ] Build contact/intake form UI.
- [ ] Add validation for name, phone, email, property address, ownership status, property condition, asking price, mortgage/liens, occupancy, timeline, and consent.
- [ ] Add file/photo upload strategy or document handoff path.
- [ ] Create `POST /api/deal-intake` or equivalent plugin endpoint.
- [ ] Add spam prevention and rate limiting.
- [ ] Add confirmation page/email/SMS workflow.

### Phase 3: Internal acquisition operations

- [ ] Connect Deal Intake submissions to Pipeline CRM.
- [ ] Define lead/deal stages such as `New Lead`, `Contacted`, `Qualified`, `Offer Needed`, `Offer Sent`, `Negotiation`, `Under Contract`, `Due Diligence`, `Funding`, `Closed`, and `Dead/Archived`.
- [ ] Connect Offer Generator to qualified deal records.
- [ ] Connect Document Library to each deal record.
- [ ] Add internal acquisition dashboard views.
- [ ] Add role-based access controls for seller PII and deal documents.

### Phase 4: Buyer/funding/command center

- [ ] Connect Buyer Portal for approved deals only.
- [ ] Connect Funding Tracker for funding and closing status.
- [ ] Connect Command Center reporting for acquisition KPIs.
- [ ] Add audit logs for lead creation, status changes, offers, document uploads, buyer publication, and funding changes.
- [ ] Add export/reporting options.

### Phase 5: Production hardening

- [ ] Configure environment variables for all integrations.
- [ ] Add error monitoring and submission failure alerts.
- [ ] Add privacy policy and consent capture.
- [ ] Add data retention rules.
- [ ] Add automated tests for forms, API routes, shortcodes, and integrations.
- [ ] Add production smoke tests for each public seller page and each plugin connection.
- [ ] Verify mobile responsiveness and accessibility.

## Production readiness rating

**Rating: 1 / 10 — Discovery-only, not production-ready.**

Rationale:

- The requested audit document now exists.
- The repository has a functioning app structure, but it is not structured around Algonquian Real Estate.
- None of the requested seller acquisition pages were found.
- No FSBO-specific seller intake workflow was found.
- No required real-estate deal acquisition shortcodes were found.
- No requested plugin connections were found.
- No CRM, offer, document, buyer portal, funding, or reporting integrations were found.

A rating above 5/10 would require at least public seller pages, a validated intake form, persisted lead records, and a working Deal Intake to Pipeline CRM handoff. A rating above 8/10 would require all plugin connections, access controls, audit logs, production monitoring, legal/compliance review, and tested end-to-end deal acquisition workflows.
