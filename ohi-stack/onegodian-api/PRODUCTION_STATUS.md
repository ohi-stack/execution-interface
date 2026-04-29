# Production Status

## Deployment
- **Host:** Hostinger
- **Live domain:** `https://api.onegodian.org`
- **Current API version:** `0.3.0`
- **Status date:** April 29, 2026

## Live Endpoint Verification (Passing)
The following production endpoints are currently passing:

- `GET /health` → `ok: true`
- `GET /ready` → `ready: true` with `routes`, `billing`, `products`, and `members` checks passing
- `GET /version` → `onegodian-api v0.3.0`
- `GET /api/products` → returns 2 live digital products:
  - OneGodian Alignment Prompt™ + Developer Kit — `$49`
  - The OneGodian Algorithm™ PDF — `$29`

## Known Browser Testing Issue
When multiple URLs are pasted together into a browser address bar at once, browser-based testing may fail or produce invalid requests. Test each endpoint URL one at a time, or use the documented `curl` commands and automated smoke test script.

## Notes
- Do not include API keys, secrets, bearer tokens, or private credentials in documentation, test commands, logs, screenshots, or terminal history.
