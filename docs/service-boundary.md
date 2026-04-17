# Onegodian Service Boundary (Workspace Implementation)

## Commercial vs governance boundary
- ONEGODIAN, LLC routes/services in this repo are limited to commercial/IP-facing product, checkout, docs, and prompt/runtime tooling.
- Indigenous Nation of Onegodia™ governance is not implemented in this codebase and must remain operationally separate.

## Repo boundary note
This implementation is a temporary foundation in `execution-interface` due to missing local access to:
- `onegodian-org`
- `onegodian-api`
- `onegodian-llm`

Migration target:
- Org pages/components/docs -> `onegodian-org`
- Commerce API/models/webhooks -> `onegodian-api`
- Prompt loader/guardrails/stage framework -> `onegodian-llm`

## Time boundary
- Gregorian/UTC is canonical for persistence and API handling.
- OT (OTS-V5) is supplemental and computed only.
