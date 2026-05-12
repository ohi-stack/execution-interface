# Hostinger Node Deployment — ONEGODIAN Capital Portal

This repository runs the Hostinger Node app for `capital.onegodian.com`.

- WordPress/WooCommerce remains the checkout and marketing layer.
- This Next.js application is the capital portal application layer.
- API/database integration is the next phase where not yet implemented.

## Deploy Steps

1. `npm install`
2. `npm run build`
3. `npm run start`

## Required Environment Variable

- `NEXT_PUBLIC_SITE_URL=https://capital.onegodian.com`

## Smoke Test Routes

- `/`
- `/offerings`
- `/investor-portal`
- `/disclosures`
- `/certificates`
- `/production-readiness`
- `/api/health`
- `/api/readiness`
