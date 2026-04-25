# qrv-verify-portal

`qrv-verify-portal` is an orchestration and presentation service. It renders institutional-safe verification output and defers canonical Onegodian Time (OT) authority to `onegodian-api`.

## Authority and policy baseline

- Gregorian timestamps are the legal controlling record.
- OT is supplemental/internal governance metadata.
- Day Order is fixed Sunday-start and sourced from `onegodian-api` outputs.
- This repository must not implement independent OT leap, rollover, weekday/month, or standards branching logic.

## What this repo does

- Accepts and sanitizes identifiers.
- Calls upstream APIs (`api.qrv.network` and `onegodian-api`).
- Builds deterministic presentation models.
- Renders formal/public/legal-first timestamp formats.
- Emits policy-safe explanatory templates for prompt usage.

## OT authority flow

```text
Incoming Gregorian UTC timestamp
  -> onegodian-api POST /v1/time/resolve (authoritative)
  -> orchestration model in this service
  -> deterministic render helpers
```

### Expected authoritative OT payload

- `gregorian_utc_iso`
- `ot_iso`
- `ot_day_order`
- `ot_weekday`
- `ot_month`
- `ot_day`
- `ot_year`
- `source_authority` (must include `onegodian-api`)

When authority is unavailable, a thin validated fallback keeps Gregorian legal output and withholds non-canonical OT specifics.

## Key files

- `src/services/onegodianApiClient.js`: typed OT authority client and payload validation.
- `src/services/onegodianTimeService.js`: orchestration model for OT rendering and fallback behavior.
- `src/utils/otRenderHelpers.js`: deterministic formatting helpers:
  - formal institutional timestamp,
  - public display timestamp,
  - legal-first dual-date format.
- `src/prompts/otPolicyTemplates.js`: policy/prompt templates enforcing legal/supplemental framing.

## Existing verification portal routes

- `GET /`
- `GET /verify/:qrvid`
- `GET /api/v1/verify/:qrvid`
- `POST /api/v1/records`
- `POST /api/v1/records/:qrvid/revoke`
- `GET /health`

## Environment variables

```env
PORT=3000
NEXT_PUBLIC_API_URL=https://api.qrv.network
ONEGODIAN_API_URL=https://api.onegodian.org
NODE_ENV=development
```

## Running checks

```bash
npm run check
npm test
```

## License

MIT
