# Live Production Checklist

- Canonical host is `https://omos.onegodian.com`.
- `/`, `/manifest`, and `/health` remain reachable.
- Verify `/api/health` reports production status and plugin sync availability.
- Verify `/api/manifest` includes plugin sync endpoint metadata.
- Verify runtime inventory endpoints:
  - `/api/tools`
  - `/api/artifacts`
  - `/api/dashboard`
  - `/api/system-health`
- Verify plugin sync endpoints:
  - `/api/plugin-consumers`
  - `/api/plugin-shortcodes`
  - `/api/plugin-sync`
- Run smoke tests before deployment.
- Confirm no secrets are committed.
