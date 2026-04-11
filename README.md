# qrv-verify-portal (Onegodian orchestration layer)

This repository is an orchestration and presentation layer. It does **not** own canonical Onegodian Time (OT) calculations. Canonical OT authority is delegated to `onegodian-api`.

## Authority model

- **Gregorian timestamps are legally controlling.**
- **OT is supplemental/internal governance metadata.**
- **Day Order is fixed Sunday-start** and must come from authoritative API responses.
- Local code in this repository must not branch into independent OT standards or alternate rollover/leap logic.

## Role in system architecture

```text
Client/UI -> this repository (orchestration + rendering) -> onegodian-api (canonical OT authority)
```

This service:
- validates inputs,
- calls upstream APIs,
- renders deterministic institutional/public/legal-first timestamp strings,
- and presents policy-safe OT explanations.

This service does **not**:
- compute canonical OT conversions independently,
- define OT leap/year/month/Day Order rules,
- maintain OTS-V4 branches or legacy weekday/month mappings.

## Onegodian API dependency

The orchestration layer expects a canonical OT resolution endpoint:

- `POST /v1/time/resolve`
- request:
  - `gregorian_utc_iso` (RFC3339 UTC string)
  - `weekday_system: "SUNDAY_START_FIXED"`
- response (authoritative):
  - `gregorian_utc_iso`,
  - `ot_iso`, `ot_day_order`, `ot_weekday`, `ot_month`, `ot_day`, `ot_year`,
  - `source_authority` containing `onegodian-api`.

If upstream authority is unavailable, this service may provide a thin validated fallback message that preserves Gregorian legal context and explicitly withholds non-canonical OT values.

## OT rendering helpers

The repository includes deterministic render helpers for:

- **Formal institutional timestamp**
- **Public display timestamp**
- **Legal-first dual-date format**

See `src/utils/otRenderHelpers.js`.

## Prompting/policy templates

OT policy/prompt templates are provided in `src/prompts/otPolicyTemplates.js` and encode:

- Gregorian legal primacy,
- OT supplemental/internal governance role,
- Sunday-start fixed Day Order,
- deterministic non-speculative fallback wording.

## Existing verification portal scope

Legacy QR-V verification endpoints and views remain in this repository. They are orchestration/UI surfaces and should continue to avoid owning external source-of-truth business logic.

## Environment variables

```env
PORT=3000
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
