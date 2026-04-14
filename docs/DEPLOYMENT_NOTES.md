# Deployment Notes

## Runtime
- Start command: `npm start`
- Health endpoint: `GET /health`

## Environment
- `PORT` (default `3000`)
- `NEXT_PUBLIC_API_URL` (upstream verification API)
- `NODE_ENV` (`production` in deployed environments)

## Public Entry Endpoint
- `GET /api/omos/identity-definition`
- Safe for public read; returns classification definitions and guardrails.

## Protocol Integration Endpoint
- `POST /api/omos/classify`
- Use `protocol/schemas/identity-classification-response.schema.json` for validation.
