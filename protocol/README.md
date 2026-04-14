# OneGodian Protocol Layer (Production Package)

Version: `1.0.0`

This package provides production-ready assets for OneGodian identity classification integration.

## Scope
- Application-level identity classification only.
- Institution-safe wording for commercial deployment under **ONEGODIAN, LLC**.
- Clear separation from **Indigenous Nation of Onegodia (INO)** institutional identity.
- Gregorian UTC is canonical for system/legal records; OT is derived only.

## Integration Artifacts
- `classification.spec.json` — machine-readable protocol and scoring rules.
- `schemas/identity-classification-response.schema.json` — JSON Schema for API response validation.
- `examples/classification-api-contract.json` — concrete request/response contract example.
- `tests/classification-test-cases.json` — deterministic integration test vectors.
- `VERSION` — explicit package version.

## Runtime Endpoint
- `POST /api/omos/classify` — compute score and classification tier.
- `GET /api/omos/identity-definition` — public classification definition endpoint.

## Deterministic Formula
`score = studyHours + (serviceActs*2) + (mentorshipCount*5)`

Tier thresholds:
- Seeker: `>= 0`
- Believer: `>= 25`
- Onegodian: `>= 50`
- Elder: `>= 80`

## Definition of Done
Integration is complete when:
1. Calling `POST /api/omos/classify` returns schema-valid JSON.
2. Returned tier matches provided test vectors.
3. Deploy docs identify canonical time standard and legal guardrails.
