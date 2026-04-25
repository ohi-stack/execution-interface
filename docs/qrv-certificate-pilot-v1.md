# QRV Certificate Pilot v1

## Scope
Certificate-first QRV v1 covering onboarding, billing, create, verify, revoke with deterministic public statuses:
`VERIFIED`, `REVOKED`, `EXPIRED`, `NOT_FOUND`.

## Core endpoints
- Issuer onboarding: `/api/v1/onboarding/signup`, `/api/v1/onboarding/verify-email`, `/api/v1/onboarding/:issuer_id/profile`, `/api/v1/onboarding/:issuer_id/api-key`
- Billing: `/api/v1/billing/plans`, `/api/v1/billing/checkout`, `/api/v1/billing/:issuer_id/status`
- Certificates: `POST /api/v1/issuer/certificates`, `POST /api/v1/issuer/certificates/:qrvid/revoke`, `GET /api/v1/verify/:qrvid`

## Seeded demo certificate
- `QRV-PROD-CERT-000001`

## Acceptance test instructions
1. **Create issuer account**
   ```bash
   curl -s -X POST http://localhost:3000/api/v1/onboarding/signup \
     -H 'content-type: application/json' \
     -d '{"email":"issuer@example.com","password":"strongpass12345","company_name":"Issuer Inc"}'
   ```
2. **Verify email + create profile + generate API key**
   - Use `verification_token` from signup response with `/api/v1/onboarding/verify-email`
   - POST profile to `/api/v1/onboarding/{issuer_id}/profile`
   - POST `/api/v1/onboarding/{issuer_id}/api-key`
3. **Start billing (trial + Stripe checkout)**
   ```bash
   curl -s -X POST http://localhost:3000/api/v1/billing/checkout \
     -H 'content-type: application/json' \
     -d '{"issuer_id":"issuer_x","plan":"starter","trial_days":14}'
   ```
4. **Create certificate**
   ```bash
   curl -s -X POST http://localhost:3000/api/v1/registry/create \
     -H 'content-type: application/json' -H 'x-api-key: acc-key-001' -H 'x-actor-role: issuer' \
     -d '{"qrvid":"QRV-PROD-CERT-000002","issuer":"issuer-qrv-prod-001","subject":"pilot-subject-2","certificate_title":"Completion Certificate","issued_at_utc":"2026-04-24T00:00:00Z","proof_reference":"proof:qrv:test:2"}'
   ```
5. **Verify certificate (public scan should be VERIFIED)**
   ```bash
   curl -s http://localhost:3000/api/v1/verify/QRV-PROD-CERT-000002
   ```
6. **Revoke certificate and verify REVOKED**
   ```bash
   curl -s -X POST http://localhost:3000/api/v1/revoke \
     -H 'content-type: application/json' -H 'x-api-key: acc-key-001' -H 'x-actor-role: admin' \
     -d '{"qrvid":"QRV-PROD-CERT-000002","revoked_at_utc":"2026-04-24T01:00:00Z","reason":"pilot revoke"}'
   ```
7. **Confirm NOT_FOUND and scan QR URL**
   - `curl -s http://localhost:3000/api/v1/verify/QRV-NOT-FOUND-000001`
   - Open `http://localhost:3000/verify/QRV-PROD-CERT-000001`
