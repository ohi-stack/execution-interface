# QR-V Registry API

## Base Behavior

All responses are JSON. Success responses return a `data` envelope. Failure responses return an `error` envelope with a stable code and message.

## Endpoints

### `GET /`
Returns service identity, role, and endpoint metadata for operators and upstream integrations.


### `GET /health`
Returns service and database readiness.

### `GET /registry/:qrvid`
Returns the canonical registry record for the supplied QRVID.

### `POST /registry/create`
Creates a new registry object, canonical hash entry, optional certificate record, and audit log entry.

### `POST /registry/issuer/create`
Creates a new issuer registry record and audit log entry.

### `GET /registry/issuers/:id`
Returns issuer metadata by issuer UUID.

### `POST /registry/:qrvid/revoke`
Transitions a registry record to `revoked` and appends an audit entry.

### `GET /registry/:qrvid/audit`
Returns the audit trail for a QRVID.
