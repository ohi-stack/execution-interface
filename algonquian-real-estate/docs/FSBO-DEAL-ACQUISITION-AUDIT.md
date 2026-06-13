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
# FSBO Deal Acquisition Audit

Repository: `ohi-stack/execution-interface`

Audit scope: Algonquian Real Estate website/platform structure for FSBO and direct-to-owner deal acquisition workflows.

Date prepared: 2026-06-12

## Executive Summary

This audit evaluates whether the current Algonquian Real Estate platform structure supports a complete FSBO acquisition workflow from public seller contact through internal deal intake, pipeline management, offer generation, document handling, buyer disposition, funding tracking, and executive reporting.

Based on repository search results available during this audit, the expected FSBO acquisition pages and workflow connection files were not clearly located in the repository. The platform should therefore be treated as requiring a dedicated FSBO acquisition build-out before it is considered production-ready for direct seller campaigns.

## Required Workflow

Target seller journey:

1. Seller visits public page.
2. Seller selects a property situation or completes intake form.
3. Lead is captured by Deal Intake.
4. Lead creates or updates a deal record.
5. Deal moves into Pipeline CRM.
6. Underwriting and offer preparation occur.
7. Offer Generator creates an offer package.
8. Document Library stores seller-facing and internal documents.
9. Funding Tracker records capital requirements where needed.
10. Buyer Portal supports disposition or buyer review where applicable.
11. Command Center reports lead, offer, contract, funding, and close metrics.

## Audit Checklist

| Requirement | Status | Notes |
| --- | --- | --- |
| Sell Your Property landing page | Missing / Not Confirmed | Expected route: `/sell-your-property`. |
| FSBO seller page | Missing / Not Confirmed | Expected route: `/fsbo` or `/for-sale-by-owner`. |
| Seller financing page | Missing / Not Confirmed | Expected route: `/seller-financing`. |
| Inherited property page | Missing / Not Confirmed | Expected route: `/inherited-property`. |
| Vacant property page | Missing / Not Confirmed | Expected route: `/vacant-property`. |
| Contact/intake form | Missing / Not Confirmed | Should route submissions to Deal Intake. |
| Deal Intake plugin connection | Missing / Not Confirmed | Required for seller lead capture. |
| Pipeline CRM connection | Missing / Not Confirmed | Required for lead-to-close workflow tracking. |
| Offer Generator connection | Missing / Not Confirmed | Required for LOI, purchase offer, and creative finance offers. |
| Document Library connection | Missing / Not Confirmed | Required for seller guides, disclosures, templates, and transaction files. |
| Buyer Portal connection | Missing / Not Confirmed | Required for buyer-side review/disposition. |
| Funding Tracker connection | Missing / Not Confirmed | Required for private money, seller-finance, JV, and closing capital tracking. |
| Command Center reporting connection | Missing / Not Confirmed | Required for executive-level KPI visibility. |

## Existing Files Found

No clearly matching FSBO acquisition page, seller financing page, inherited property page, vacant property page, or end-to-end plugin workflow connection file was identified from the repository search terms used for this audit.

This does not prove the files do not exist under unrelated names. It means the repository should be organized with explicit, searchable names for production maintenance.

Recommended naming standards are included below.

## Missing Pages

The following public pages should be created or confirmed:

1. `/sell-your-property`
   - Primary seller intake landing page.
   - Must include property submission form.
   - Should route directly into Deal Intake.

2. `/fsbo`
   - Education and conversion page for For Sale By Owner sellers.
   - Should explain direct sale, local help, flexible options, and next steps.

3. `/seller-financing`
   - Explains seller financing in plain terms.
   - Should avoid guaranteeing terms.
   - Should invite seller discussion.

4. `/inherited-property`
   - For heirs, families, and estate-related property owners.
   - Should use careful language and not offer legal advice.

5. `/vacant-property`
   - For owners with vacant, remote, under-maintained, or difficult-to-manage property.

6. `/contact`
   - General contact page.
   - Should include phone, email, and intake form.

7. `/property-evaluation`
   - Optional but recommended public intake page for owners who want a review before deciding whether to sell.

## Missing Plugin Connections

The following integration points should be confirmed or implemented:

### Deal Intake

Required function:

- Accept public seller submissions.
- Sanitize all inputs.
- Create a seller lead record.
- Create or link a property record.
- Generate a deal ID.
- Record lead source as `FSBO`, `Seller Financing`, `Inherited Property`, `Vacant Property`, or `General Seller Lead`.

### Pipeline CRM

Required function:

- Automatically create a pipeline card after Deal Intake submission.
- Default stage: `Lead Captured`.
- Recommended stages:
  - Lead Captured
  - Contact Attempted
  - Seller Conversation
  - Underwriting
  - Offer Sent
  - Follow-Up
  - Under Contract
  - Buyer Assigned
  - Closed
  - Dead Lead

### Offer Generator

Required function:

- Pull deal data from Deal Intake/Pipeline CRM.
- Generate seller-facing documents.
- Minimum templates:
  - Letter of Intent
  - Cash Offer Summary
  - Seller Financing Proposal
  - Purchase Agreement Draft
  - Subject-To Discussion Summary, if used

### Document Library

Required function:

- Store public education documents.
- Store internal templates.
- Store generated deal documents.
- Recommended public documents:
  - Connecticut FSBO Seller Guide
  - Seller Financing Overview
  - Inherited Property Checklist
  - Vacant Property Owner Checklist
  - Property Sale Preparation Checklist

### Buyer Portal

Required function:

- Display approved deals to buyers or partners.
- Support NDA gate where applicable.
- Track buyer interest.
- Control access to deal packages.

### Funding Tracker

Required function:

- Track funding requirements by deal.
- Record capital source, target amount, committed amount, projected closing date, and funding status.
- Support seller financing and private-lender structures.

### Command Center

Required function:

- Report seller acquisition KPIs.
- Required metrics:
  - New seller leads
  - FSBO leads
  - Seller financing leads
  - Vacant property leads
  - Inherited property leads
  - Offers sent
  - Contracts pending
  - Buyer assignments
  - Funding gaps
  - Closed deals

## Required Shortcodes

Shortcodes should be implemented or confirmed using stable, namespaced identifiers.

Recommended public shortcodes:

```text
[algq_sell_property_form]
[algq_fsbo_contact_form]
[algq_property_evaluation_form]
[algq_seller_financing_inquiry]
[algq_inherited_property_form]
[algq_vacant_property_form]
```

Recommended internal shortcodes:

```text
[algq_deal_intake_admin]
[algq_pipeline_board]
[algq_offer_generator]
[algq_document_library]
[algq_funding_tracker]
[algq_buyer_portal]
[algq_command_center]
```

WPBakery usage note:

Use:

```text
[vc_column_text]
Content here
[/vc_column_text]
```

Do not use HTML-style closing tags for WPBakery shortcodes.

## Recommended Folder Structure

```text
algonquian-real-estate/
  pages/
    public/
      sell-your-property.md
      fsbo.md
      seller-financing.md
      inherited-property.md
      vacant-property.md
      contact.md
      property-evaluation.md
    internal/
      dashboard.md
      deals.md
      pipeline.md
      documents.md
      funding.md
      buyers.md
  plugins/
    algq-deal-intake/
    algq-pipeline-crm/
    algq-offer-generator/
    algq-document-library/
    algq-buyer-portal/
    algq-funding-tracker/
    algq-command-center/
  docs/
    FSBO-DEAL-ACQUISITION-AUDIT.md
    FSBO-WORKFLOW.md
    SHORTCODE-MAP.md
    PAGE-MAP.md
    PLUGIN-INTEGRATION-MAP.md
  wpbakery/
    sell-your-property.wpbakery.txt
    fsbo.wpbakery.txt
    seller-financing.wpbakery.txt
    inherited-property.wpbakery.txt
    vacant-property.wpbakery.txt
  assets/
    images/
    css/
    js/
  intake-flows/
    fsbo-lead-flow.md
    seller-finance-lead-flow.md
    inherited-property-flow.md
    vacant-property-flow.md
```

## Build Checklist

### Phase 1: Public Acquisition Pages

- [ ] Create Sell Your Property page.
- [ ] Create FSBO seller page.
- [ ] Create Seller Financing page.
- [ ] Create Inherited Property page.
- [ ] Create Vacant Property page.
- [ ] Create Property Evaluation page.
- [ ] Add clear calls to action to every page.
- [ ] Add phone and email contact information.

### Phase 2: Intake Forms

- [ ] Build seller intake form.
- [ ] Build FSBO-specific form.
- [ ] Build seller-financing inquiry form.
- [ ] Build inherited property form.
- [ ] Build vacant property form.
- [ ] Add nonce protection.
- [ ] Sanitize all inputs.
- [ ] Escape all outputs.
- [ ] Save form submissions to Deal Intake records.

### Phase 3: Internal Workflow

- [ ] Auto-create deal ID.
- [ ] Auto-create Pipeline CRM card.
- [ ] Assign lead source.
- [ ] Add follow-up task support.
- [ ] Add notes and activity log.
- [ ] Add document generation trigger.

### Phase 4: Documents and Offers

- [ ] Add LOI template.
- [ ] Add cash offer summary template.
- [ ] Add seller financing proposal template.
- [ ] Add purchase agreement draft template.
- [ ] Save generated documents to Document Library.

### Phase 5: Buyer/Funding/Reporting

- [ ] Connect qualified deals to Buyer Portal.
- [ ] Add funding needs to Funding Tracker.
- [ ] Add FSBO metrics to Command Center.
- [ ] Add CSV/PDF export for acquisition reports.

### Phase 6: QA and Compliance

- [ ] Test public forms while logged out.
- [ ] Test admin workflow while logged in.
- [ ] Test duplicate lead handling.
- [ ] Test required fields and validation messages.
- [ ] Confirm no unescaped output.
- [ ] Confirm no unauthorized admin access.
- [ ] Confirm email notification delivery.
- [ ] Confirm records are retained in the correct plugin tables.

## Production Readiness Rating

Current FSBO workflow readiness: **45%**

Rationale:

- The business strategy and required workflow are clear.
- The platform plugin architecture appears suitable for the workflow.
- The public acquisition page layer and explicit FSBO content map are not confirmed.
- The end-to-end plugin integration path is not confirmed.
- Required seller-facing forms, shortcodes, and routing must be confirmed or built.

Target readiness after completing this checklist: **85% to 92%**

A 95%+ rating should not be assigned until public form submissions have been tested on the live WordPress site, internal deal records are created automatically, documents generate correctly, and Command Center reporting reflects actual acquisition activity.

## Immediate Next Task

Create the public FSBO acquisition page package and shortcode map:

```text
algonquian-real-estate/pages/public/sell-your-property.md
algonquian-real-estate/pages/public/fsbo.md
algonquian-real-estate/pages/public/seller-financing.md
algonquian-real-estate/pages/public/inherited-property.md
algonquian-real-estate/pages/public/vacant-property.md
algonquian-real-estate/docs/SHORTCODE-MAP.md
algonquian-real-estate/docs/PLUGIN-INTEGRATION-MAP.md
```

Then implement the required shortcodes in the Deal Intake plugin and connect submissions to Pipeline CRM.
