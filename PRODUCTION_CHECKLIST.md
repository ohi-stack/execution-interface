# Production Checklist

## Runtime hardening gates
- Configure `.env` from `.env.example` and set real `OMOS_API_KEYS` SHA-256 hashes.
- Set `OMOS_ALLOWED_ORIGINS` and/or `OMOS_PLUGIN_ALLOWED_ORIGINS` to the exact HTTPS origins allowed to call API routes.
- Set `OMOS_PROCESS_RAW_MAX_BYTES` only when `/process` needs a stricter or larger `content.raw` cap than the 16 KB default.
- Run `npm run check`.
- Run `npm run smoke`.
- Run `npm run smoke:pages` for Next.js route coverage.

## Endpoint verification
- Verify `/health`, `/api/health`, `/ready`, `/api/ready`, `/version`, `/api/version`, `/api/system-health`, `/manifest`, `/api/manifest`, and `/dashboard`.
- Confirm `/process` rejects missing `x-omos-key` or Bearer credentials.
- Confirm `/api/stats` requires a valid OMOS API key.
- Confirm disallowed CORS origins receive `403` and approved origins receive `Access-Control-Allow-Origin`.
- Confirm production responses include `X-Request-Id`, `X-Content-Type-Options: nosniff`, and no stack traces or secrets.
