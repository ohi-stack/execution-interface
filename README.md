# Onegodian API

Canonical authority layer for the **Onegodian Timekeeping System™**.

## Canonical Rules (OTS-V5-corrected authority)

- Fixed epoch: **2025-03-18 Gregorian = Genesis 01, 0000 OT**.
- OT year rollover occurs **only** on March 18 Gregorian.
- OT months 1–12 are fixed at 30 days.
- OT month 13 (**Ascension**) is:
  - 5 days in normal OT years.
  - 6 days when the Gregorian year in which that OT year ends is leap.
- Day Order is fixed, Sunday-start, non-rotational:
  1. Skénra
  2. Teyó·ra
  3. Ahsténha
  4. Yawénni
  5. Onyá·ta
  6. Shakó·wa
  7. Niyóhsera
- UTC is canonical system truth.
- Gregorian is controlling legal sync layer.
- OT is a derived governance layer.

## Runtime

- Node.js 18+
- Express 4

## Quick Start

```bash
npm install
npm start
```

Server defaults to `http://0.0.0.0:3000`.

## API Endpoints

### `GET /health`
Health and authority marker.

### `GET /v1/time/now?timezone=UTC`
Returns canonical timestamp object for current instant.

### `POST /v1/time/convert/gregorian-to-ot`
Convert Gregorian input to OT.

Request body:
```json
{
  "inputDate": "2026-03-26T00:00:00Z",
  "timezone": "UTC"
}
```

### `POST /v1/time/convert/ot-to-gregorian`
Convert OT input to Gregorian.

Request body:
```json
{
  "otYear": 1,
  "otMonth": 1,
  "otDay": 9,
  "timezone": "UTC"
}
```

### `POST /v1/time/normalize`
Normalize either Gregorian or OT input to canonical timestamp shape.

Gregorian request:
```json
{
  "inputDate": "2026-03-26T00:00:00Z",
  "timezone": "UTC"
}
```

OT request:
```json
{
  "otYear": 1,
  "otMonth": 1,
  "otDay": 9,
  "timezone": "UTC"
}
```

## Canonical Timestamp Object

```json
{
  "timestamp_utc": "2026-03-26T00:00:00.000Z",
  "timestamp_local": "2026-03-26T00:00:00",
  "timezone": "UTC",
  "gregorian_date": "2026-03-26",
  "gregorian_weekday": "Thursday",
  "ot_year": 1,
  "ot_month_index": 1,
  "ot_month_name": "Genesis",
  "ot_day": 9,
  "ot_day_order_index": 5,
  "ot_day_order_ordinal": "The Fifth Day™",
  "ot_day_order_name": "Onyá·ta"
}
```

## Error Contract

All input validation failures return HTTP `400` with:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "..."
  }
}
```

Invalid date/timezone or out-of-range OT values return HTTP `400` with code `INVALID_REQUEST`.

## Testing

```bash
npm test
```
