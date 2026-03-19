# QR-V Registry Data Model

## Canonical Tables

### `qr_objects`
Stores the canonical registry object keyed by UUID and uniquely addressable by QRVID. This table captures the record type, lifecycle state, issuer relationship, human-readable labels, and the current canonical hash.

### `qr_issuers`
Stores metadata for issuers participating in the QR-V network, including operational status and contact references.

### `qr_certificates`
Stores optional certificate-specific details attached to a canonical QR object. The table is designed so additional record-specific tables can be added later for identities, products, or documents without changing the object root pattern.

### `qr_hash_registry`
Stores hash events for QR objects to preserve algorithm and validity status independently from the root object row.

### `qr_audit_log`
Stores write-path audit events, including creation and revocation actions. The table is intended to expand later to support richer compliance and operational observability requirements.

## Design Considerations

- UUIDs are generated in the application layer for portability.
- QRVID is the deterministic lookup key exposed to upstream and downstream services.
- Object revocation is implemented as a lifecycle state transition rather than a hard delete.
- JSONB fields provide structured expansion points for certificate metadata and audit details.
- Multi-tenant support can later be introduced by expanding issuer scoping and authorization rules while preserving the current canonical data model.
