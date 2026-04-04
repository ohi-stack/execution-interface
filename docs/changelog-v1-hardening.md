# Changelog: V1 Hardening

## Added
- HMAC SHA-256 signing with bridge headers for all gateway writes.
- Idempotency key generation for issue/revoke flows and order meta persistence.
- DB-backed event log and retry queue tables with indexes.
- Circuit breaker with 3-failure threshold and 60-second open interval.
- Deterministic issue/revoke envelopes aligned to Node contract.
- WooCommerce thank-you/admin verification URL rendering and shortcode-safe verification handling.
- Admin settings panel with nonce/capability checks and secret masking.
- Utility tests for signature, idempotency, deterministic hashing, and backoff.

## Updated
- Plugin version to `1.2.0`.
- Documentation for architecture/security/retry operations.
