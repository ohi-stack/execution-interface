# QR-V Execution Interface Architecture

The execution interface now hosts two coordinated layers:

1. **Verification portal layer** for browser-based QRVID resolution.
2. **Registry API layer** for record creation, verification, and database health.

## Request flows

### Portal flow

```text
QR Scan -> /:qrvid or /verify/:qrvid -> verificationService -> API_BASE_URL/api/verify or remote API -> rendered HTML result
```

### Registry flow

```text
POST /api/records -> registryService -> Postgres
GET /api/verify/:qrvid -> registryService -> Postgres -> JSON verification payload
```

## Startup behavior

- `server.js` loads environment variables.
- If `DATABASE_URL` is configured, the service initializes the registry schema using `migrations/001_initialize_registry.sql`.
- The Express app exposes portal and API routes from the shared `/src` structure.

## Failure behavior

- Portal verification failures render deterministic unavailable states.
- Registry database configuration failures return structured `503` JSON responses.
- Invalid JSON payloads return `400` responses.
