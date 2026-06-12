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
