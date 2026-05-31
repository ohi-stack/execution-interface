# Algonquian Document Library

WordPress plugin module for institutional document categories, version-aware document records, search-ready tagging, and PDF storage management foundations.

## Shortcode

Use `[algq_document_library]` to render the institutional document library. The shortcode lists the approved documentation categories and shows the latest published documents in each category.

## Institutional documentation categories

The library is aligned to the following categories:

| Category | Intended records |
| --- | --- |
| Entity documents | Formation records, operating agreements, governance resolutions, EIN letters, registered-agent records, and entity compliance files. |
| Lender documents | Term sheets, proof-of-funds letters, commitment letters, loan packages, draw schedules, lender requirements, and funding correspondence. |
| Acquisition forms | LOIs, purchase agreements, seller disclosures, due-diligence checklists, assignment contracts, and closing intake forms. |
| Financial controls | Approval matrices, wire instructions, budget controls, payment logs, reconciliation checklists, and audit-support records. |
| Risk management | Insurance binders, risk reviews, compliance notes, inspection exceptions, mitigation plans, and legal review artifacts. |
| Property management forms | Tenant forms, maintenance requests, vendor onboarding, lease administration, inspection reports, and turnover checklists. |

## Admin model

- Registers a private `algq_document` custom post type for controlled document records.
- Registers a hierarchical `algq_doc_category` taxonomy for the institutional categories.
- Seeds the six approved categories on activation and before shortcode rendering.
- Keeps document records private by default while exposing admin UI, revisions, custom fields, and category columns for future PDF metadata, version numbers, tags, and access controls.
