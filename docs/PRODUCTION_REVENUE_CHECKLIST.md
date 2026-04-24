# Production Revenue Checklist (execution-interface)

## Phase 1 — LMS Monetizable MVP

- [x] Stripe checkout session bootstrap endpoint in LMS (`POST /wp-json/og-lms/v1/stripe/checkout-session`).
- [x] Stripe webhook ingestion endpoint with HMAC verification (`POST /wp-json/og-lms/v1/stripe/webhook`).
- [x] Enrollment automation on checkout completion (webhook -> enrollment insert).
- [x] Payment record persistence (`wp_og_payments`) for completed transactions.
- [x] Dashboard progress persistence (`POST /wp-json/og-lms/v1/progress`) and retrieval (`GET /wp-json/og-lms/v1/progress/{course_id}`).
- [x] Certificate issuance endpoint with DB record and generated downloadable PDF (`POST /wp-json/og-lms/v1/certificates/issue`).

## Phase 2 — Security Hardening

- [x] Replaced weak admin middleware token scheme in identity engine with dedicated `ADMIN_API_TOKEN` bearer auth.
- [x] Protected `/api/admin/*` through middleware enforcement.
- [x] Downloads endpoint now requires authenticated ownership via bearer token user identity.
- [x] Added in-memory rate limiting to public write APIs (`generate`, `checkout/create-session`, `referrals`, `email`) and LMS progress route.
- [x] Stripe webhook signature validation + duplicate order suppression (idempotent behavior) in identity engine.

## Phase 3 — Analytics

- [x] LMS conversion and lifecycle activity logging (checkout completed, enrollment created, certificate issued) into `wp_og_activity_log`.
- [x] LMS admin metrics endpoint (`GET /wp-json/og-lms/v1/metrics`) with enrollment and gross revenue rollups.

## Launch Validation Commands

1. `npm ci`
2. `npm run check`
3. `npm --prefix onegodian-identity-engine run typecheck`
4. `php -l onegodian-university-lms/includes/class-rest-api.php`
5. `php -l onegodian-university-lms/modules/stripe/class-stripe-gateway.php`
6. `php -l onegodian-university-lms/modules/certificates/class-certificate-generator.php`

## Remaining Production TODOs (Post-MVP)

- Add server-to-server Stripe checkout session creator in LMS (direct Stripe API call instead of bootstrap payload).
- Replace in-memory rate limits with distributed limits (Redis / edge).
- Add signed certificate verification endpoint and revocation support.
- Add dashboard chart UI for conversion funnel metrics.
- Add integration tests for WordPress REST routes and webhook replay behavior.
