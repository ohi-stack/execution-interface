# Sprint 4 — Accounts and wallets completion report

## Status

**In Development.** The data model, registration foundation, authenticated profile and read-only wallet APIs, signed ownership challenges, disclosure acceptance, provider abstraction, and empty-state interfaces are implemented. Production email delivery, asynchronous history indexing, and operational production review remain incomplete, so no wallet capability is labeled Live.

## Delivered

- Prisma migration for users, profiles, sessions/tokens, wallets/challenges, balance cache, deterministic transaction records, synchronization state, versioned disclosures, security events, and integrity-linked audit logs.
- JSON registration/session/logout, profile, wallet challenge/verification/listing, cached balance/history, disclosures, and public network-health resources.
- Argon2id passwords; short-lived domain/chain-bound wallet messages; server-side signature recovery; normalized addresses; one-time challenge consumption; authenticated resource ownership checks; Zod validation; rate limiting and security headers.
- Primary/fallback Ethereum RPC abstraction. ETH and canonical ODC `balanceOf` reads use bigint values. Ethereum remains authoritative and cached rows expose retrieval metadata.
- Responsive wallets and transactions empty states with explicit non-custodial language.

## Routes and APIs

UI: `/wallets`, `/transactions`.

APIs: `POST /api/auth/register`, `GET /api/auth/session`, `POST /api/auth/logout`, `GET|PATCH /api/accounts/me`, `GET /api/wallets/me`, `POST /api/wallets/challenge`, `POST /api/wallets/verify`, `GET /api/wallets/{walletId}/balances`, `GET /api/wallets/{walletId}/transactions`, `GET /api/disclosures/me`, `POST /api/disclosures/accept`, and `GET /api/network/status`.

## Security and non-custody review

The schema contains public addresses and signature challenges but no private-key, seed-phrase, signing, transfer, balance-editing, or internal-ledger facility. Provider credentials are server-only. Public health output reports configuration status, never provider URLs or keys. Audit metadata is HMAC protected; IP addresses and user agents are hashed where collected.

## Known limitations and deferred work

- Transaction ingestion workers, reorg reconciliation, email verification/reset delivery, persistent distributed rate limiting, rotating database session IDs, administrative resynchronization, complete admin screens, and full integration/E2E/accessibility suites remain deferred.
- The legacy operator login remains available during migration. New account sessions should move fully to database-backed rotation before Production Review.
- WalletConnect and named wallets have not completed compatibility testing and must not be advertised as supported.
- Provider operation requires configured RPC endpoints and PostgreSQL migration deployment.

## Production checklist

- [x] Canonical ODC contract and 18 decimals
- [x] Non-custodial schema and user-facing notice
- [x] Signed, expiring, one-use wallet challenge
- [x] Server-only primary/fallback RPC abstraction
- [x] Authenticated ownership checks on wallet data
- [x] Versioned disclosure and audit models
- [ ] Production email provider exercised
- [ ] Redis-backed distributed limits exercised
- [ ] Sync workers/reorg behavior load-tested
- [ ] Full browser/accessibility matrix passed
- [ ] Security review and production runbook sign-off
