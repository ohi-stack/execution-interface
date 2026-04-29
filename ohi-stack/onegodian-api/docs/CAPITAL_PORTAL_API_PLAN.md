# Capital Portal API Plan

## Purpose
This document outlines a future API namespace for the ONEGODIAN Capital Portal so capital workflows are separated from the existing members and product domains.

## Namespace
Planned endpoints:

- `/api/capital/offerings`
- `/api/capital/instruments`
- `/api/capital/investors/me`
- `/api/capital/certificates/:id`
- `/api/capital/ledger`
- `/api/capital/disclosures`

## Domain separation requirements
- **Members** represent the identity and account layer (authentication, profiles, and account ownership).
- **Capital** represents financial records and lifecycle data (notes, bonds, certificates, ledgers, and disclosures).
- Capital functionality must remain logically and operationally separate from members and products modules.

## Compliance and legal guardrails
- No securities, investment, or yield claims should be hardcoded without legal review.
- All financial terms must be configurable and backed by appropriate disclosures.
- API responses and UI integrations should reference configurable disclosure artifacts rather than embedded legal promises.

## Implementation notes (future)
- Add capital routes and controllers under a dedicated module boundary.
- Require role- and policy-based access controls for investor/account views.
- Add audit logging and immutable event tracking for ledger and certificate actions.
- Version capital endpoints independently as needed for compliance-driven changes.
