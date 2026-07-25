# Production schema

Schema version **1** creates prefixed tables for clients, family authorizations, provider profiles,
availability, bookings, care plans and immutable numbered revisions, visits, time entries, mileage
and expenses, incidents, documents, messages, notifications, payment/invoice references, training
assignments, and audit events.

All primary and relationship identifiers are unsigned 64-bit integers, matching WordPress IDs.
Indexes cover ownership and high-frequency relationship lookups. WordPress `dbDelta()` is used for
broad shared-host compatibility, so physical foreign keys are intentionally not assumed. Repository
methods use allowlisted table names, parameterized queries, record existence, active authorization,
assignment status, and staff scope to enforce integrity and prevent cross-client access.

Sensitive document bytes and integration credentials are not stored in audit events. Document rows
hold an opaque storage key. Care-plan content, visit notes, incident details, and messages remain in
their dedicated access-controlled records.
