# Quantum OHI Bridge Architecture

## System boundaries
- **WordPress + WooCommerce**: storefront, checkout lifecycle hooks, operator settings UI.
- **Quantum OHI Bridge plugin**: transport, request signing, idempotency, retry queue, event logging, and verification link rendering.
- **Node gateway**: execution policies, workflow processing, registry truth, verification truth.

## Node contract expected by plugin
- `GET /health`
- `POST /v1/ohi/execute`
- `GET /v1/verify?qrv_id=...`

## Outbound write envelope
- `workflow`
- `issued_at_utc`
- `metadata_hash`
- `idempotencyKey`
- `actor.role = wordpress_bridge`
- `input`

## Signed headers
- `X-QOHI-Signature`
- `X-QOHI-Timestamp`
- `X-QOHI-Actor-Role: wordpress_bridge`

## Operational resilience
- DB-backed event logging for all outbound requests.
- Retry queue with exponential backoff and capped attempts.
- Circuit breaker to prevent repeated pressure on unavailable gateway.
- Idempotency guardrails to prevent duplicate order-triggered executions.
