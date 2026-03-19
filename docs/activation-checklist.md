# QR-V Registry Activation Checklist

## Scope Clarification

This repository owns the **registry layer** for `registry.qrv.network`. It does **not** own:

- the public verification UI served from `verify.qrv.network`
- the API-layer resolver routes served from `api.qrv.network`
- DNS management itself

Those components must be activated alongside this service for the full QR-V network to become publicly observable end-to-end.

## Activation Order

1. **Deploy the registry service**
   - provision PostgreSQL
   - configure `DATABASE_URL`
   - apply migrations with `npm run migrate`
   - confirm `GET /health` succeeds

2. **Confirm API-layer registry integration**
   - the API layer must call this service for canonical lookups and writes
   - if a public resolver endpoint such as `GET /verify/:qrvid` exists in the API tier, confirm it resolves against the registry successfully

3. **Deploy the verification portal**
   - the verification portal must call the API layer or registry-facing integration expected by your network design
   - confirm a QRVID lookup renders deterministically for existing, revoked, and missing records

4. **Expose `registry.qrv.network` in DNS and ingress**
   - create DNS records
   - attach TLS
   - route traffic to the deployed registry service

## Minimum Operational Verification

- `GET /` returns service identity and endpoint metadata
- `GET /health` returns service and database readiness
- `POST /registry/issuer/create` creates an issuer
- `POST /registry/create` creates a canonical record with QRVID and hash
- `GET /registry/:qrvid` resolves the canonical record
- `POST /registry/:qrvid/revoke` transitions the record to `revoked`
- `GET /registry/:qrvid/audit` returns the write-path audit trail
