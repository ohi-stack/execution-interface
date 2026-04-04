# Quantum OHI Bridge Security

## Transport security controls
- All write actions are server-to-server via WordPress HTTP API.
- HMAC SHA-256 signing uses `X-QOHI-Signature`, `X-QOHI-Timestamp`, and `X-QOHI-Actor-Role: wordpress_bridge`.
- Signing payload format is `<unix_timestamp>.<raw_json_body>`.

## Secret handling
- `api_secret` is stored in WordPress options and never rendered in plaintext.
- Admin page masks stored secret and only updates when a new non-empty value is submitted.
- No frontend route or shortcode exposes secret values.

## Admin hardening
- Settings updates require `manage_options` capability.
- Settings writes require nonce verification.
- Inputs are sanitized by type (URL, text, boolean, int).

## Runtime controls
- Circuit breaker opens after 3 consecutive failures for 60 seconds.
- Retry queue only retries retry-safe failures (network and 5xx pathways).
- Event logs persist request/response hashes for auditability.
