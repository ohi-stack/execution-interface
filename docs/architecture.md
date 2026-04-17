# Execution Interface Architecture

## Purpose

This repository now hosts two aligned surfaces:
1. QR-V verification portal routes (existing functionality), and
2. Onegodian production-foundation routes/services used to unblock architecture-aligned delivery while canonical Onegodian repos are unavailable in this workspace.

## Onegodian architecture alignment

The implemented foundation aligns to the published four-layer structure:

- **Protocol Layer**: typed commerce models and API contracts (`/api/products`, `/api/checkout/session`, `/api/webhooks/stripe`, `/api/orders/:id`, `/api/downloads/:productId`).
- **Experience Layer**: server-rendered public site pages and reusable content components.
- **Community Layer**: institutional/public documentation routes with explicit boundary language.
- **Orientation Layer**: LLM stage-aware framework, documented-source guardrails, and prompt version control.

## Institutional boundary policy

- `ONEGODIAN, LLC` is represented as the commercial/IP entity.
- `Indigenous Nation of Onegodia™` is explicitly treated as separate governance and not merged with the commercial stack.

## Timekeeping policy (OTS-V5 corrected)

- Gregorian/UTC remains canonical for storage and API timestamps.
- OT values are derived/computed helpers only.
- OT leap-year logic is determined by whether the Gregorian year in which the OT year ends is leap-year compliant.

## Request flow (Onegodian API)

1. Client queries `/products` or `/products/:slug`.
2. Client initiates checkout via `POST /checkout/session`.
3. Payment status updates through `POST /webhooks/stripe`.
4. Order retrieval via `GET /orders/:id`.
5. Download access guarded by paid order status via `GET /downloads/:productId?orderId=...`.
