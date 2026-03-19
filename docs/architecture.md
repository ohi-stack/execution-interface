# QR-V Registry Architecture

## Role in the QR-V Global Verification Network

The `qrv-registry` repository implements the authoritative registry layer behind `registry.qrv.network`. It is not a presentation-tier application and it is not intended to behave like a generic CRUD service. Its primary responsibility is to hold the canonical verification record set used by upstream issuance and downstream verification systems.

```text
Issuer Portal → API Layer → Registry Layer → Verification Portal
```

## Service Boundaries

- **Issuer Portal** submits issuance events and issuer metadata through the API layer.
- **API Layer** validates requests, coordinates business policy, and writes canonical records into the registry.
- **Registry Layer** persists immutable identifiers, canonical hashes, lifecycle state, issuer references, and audit events.
- **Verification Portal** resolves QRVID values against the registry to present public verification outcomes.

## Production Orientation

The codebase is organized to support production deployment and future growth:

- environment-driven configuration
- migration-based PostgreSQL schema management
- deterministic hash generation from canonical JSON payloads
- centralized JSON error handling
- write-path audit trail generation
- modular separation between HTTP, services, models, and database infrastructure
- extensibility for authentication, multi-tenant issuers, and broader record families
