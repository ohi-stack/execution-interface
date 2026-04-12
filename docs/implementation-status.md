# Implementation Status

## Completed in this repository

- Onegodian site route scaffolding
  - `/onegodian`
  - `/products`
  - `/products/:slug`
  - `/docs/algorithm`
  - `/docs/system-prompt`
  - `/docs/positioning`
- Onegodian API scaffolding
  - `GET /api/products`
  - `GET /api/products/:slug`
  - `POST /api/checkout/session`
  - `POST /api/webhooks/stripe`
  - `GET /api/orders/:id`
  - `GET /api/downloads/:productId`
- LLM subsystem baseline
  - Prompt version loader (`v1.0`)
  - Documented-source guardrails
  - Stage-aware response frame builder
  - Source-constrained config
- OTS-V5 support
  - UTC canonical conversion helper
  - Gregorian primary date handling
  - OT computed date helper
  - OT leap-year logic tied to Gregorian year in which OT year ends
  - Test vectors for OT year transitions and leap behavior

## Pending (requires external repos)
- Move Onegodian org pages into `onegodian-org`
- Move commerce APIs into `onegodian-api`
- Move LLM modules into `onegodian-llm`
- Establish shared cross-repo contracts and CI policy gates
