# Production Acceleration Plan (7-Day Mapping)

Date: 2026-04-14

## What exists now
- Node/Express operational service with OMOS and verification routes.
- Early OMOS classification, alignment, decision, and OT timestamp conversion handlers.
- Existing system prompt source at `alignment/system-prompt.txt`.
- Existing governance and schema artifacts in repo.

## What is usable now
- `POST /api/omos/classify` (runtime functional).
- `POST /api/omos/align` and `POST /api/omos/decision/run` (runtime functional).
- Base documentation and health checks.

## What is missing
- Packaged protocol layer assets for integrators.
- Prompt deployment package with versioning/changelog.
- Explicit OHI pipeline module contract and payload samples.
- One narrow public entry endpoint with institution-safe messaging.
- Clear status/scope/limitations documents.

## 7-day shippable scope
1. Ship protocol package + schema + examples + tests.
2. Ship prompt deployment package.
3. Ship OHI pipeline demo module with logging contract.
4. Ship one public endpoint (`/api/omos/identity-definition`).
5. Ship root status/scope/deployment docs.

## Deferred
- Full front-end product platform.
- Real provider integration for OHI model orchestration.
- Expanded institutional or legal product claims.
