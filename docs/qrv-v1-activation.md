# QR-V V1 Activation (Production-Style Minimum Flow)

## Repo-by-repo responsibility audit

- `issuer-qrv` (implemented here as `/issuer` UI): certificate issuance form, record list, QR generation, revoke controls.
- `qrv-api` (implemented here as `/api/v1`): contract endpoints for create/verify/revoke and deterministic verification state output.
- `qrv-registry` (represented by migration files in `db/migrations`): canonical schema for issuers, objects, certificates, and audit log.
- `qrv-node` (deferred): resolver/network propagation layer. For V1 activation this service is optional because verification resolves directly through `qrv-api` + registry state.

## V1 API Contract (implemented)

- `POST /api/v1/registry/create`
  - body: create-record payload.
  - auth: JWT (`role=issuer|admin`) + headers `x-issuer-id`, `x-api-key`.
- `GET /api/v1/verify/:qrvid`
  - deterministic statuses: `VERIFIED | REVOKED | EXPIRED | NOT_FOUND`.
- `POST /api/v1/revoke`
  - body: `{ qrvid, revoked_at_utc, reason }`.
  - auth: JWT (`role=admin`) + headers `x-issuer-id`, `x-api-key`.

Legacy compatibility endpoints remain:

- `POST /api/v1/records`
- `POST /api/v1/records/:qrvid/revoke`

## Verification status logic

Deterministic mapping:

- valid => `VERIFIED`
- revoked => `REVOKED`
- expired => `EXPIRED`
- missing => `NOT_FOUND`
- invalid signature => `INVALID_SIGNATURE`

QRVID format (enforced):

- `QRV-{ENV}-{TYPE}-{ID}`
- example: `QRV-PROD-CERT-000001`

## Seeded demo flow

- Demo QRVID: `QRV-DEMO-CERT-000001`
- Seed endpoint: `POST /api/v1/seed/demo`
- Issuer UI auto-seeds if record is missing.

## Public verification page fields

`/:qrvid` renders (clean public resolver URL used in QR codes):

- Status
- Issuer
- Record Type
- Recipient
- Certificate Title
- Issued Date
- Timestamp
- Hash Reference

## Audit log

Audit events are emitted for:

- `record.create`
- `record.verify`
- `record.revoke`

## First VERIFIED scan checklist

- [x] Issue a certificate from `/issuer`.
- [x] Generate QR image pointing to `/:qrvid`.
- [x] Resolve via public verification endpoint.
- [x] Deterministic status shows `VERIFIED`.
- [x] Revoke from issuer flow.
- [x] Status transitions to `REVOKED`.
- [x] Create/verify/revoke events are logged.

## Remaining production blockers

- JWT issuance/rotation is external to this service and must be managed in deployment IAM.
- `DATABASE_URL` runtime persistence wiring remains intentionally decoupled in this repo; current runtime store is in-memory.
