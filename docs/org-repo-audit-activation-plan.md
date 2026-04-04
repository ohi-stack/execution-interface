# 1. Executive Assessment

The repository set is strategically complete, but operationally fragmented. The largest near-term risk is **role overlap without enforceable contracts** across ACC control-plane repositories and QR-V verification repositories.

Key findings:
- **Canonical cores are identifiable by naming and architectural intent**, but implementation density is likely uneven (some repos likely thin wrappers, bootstrap scaffolds, or legacy placeholders).
- **ACC fragmentation risk** is concentrated around `acc`, `acc-core`, `acc-api`, `acc-runner`, and `ohi-control-plane` where orchestration/control responsibilities can duplicate unless a single system boundary is documented and enforced.
- **QR-V activation path is clear and should be executed immediately** as: `issuer-qrv → qrv-api → qrv-registry → qrv-node → verification result`.
- **Contract-first deployment is currently the blocking factor**: missing or non-authoritative OpenAPI/event/schema artifacts will prevent reliable integration, even if service code exists.
- **Gregorian UTC (ISO-8601 UTC) must be encoded as a hard requirement** in API and event contracts (not documentation-only guidance).

30-day mission-critical focus:
- ACC: `acc-core`, `acc-api`, `acc-runner`, `acc-db`, `acc-workflows`, `acc-auth`, `acc-logs`, `acc-infra`.
- QR-V: `issuer-qrv`, `qrv-api`, `qrv-registry`, `qrv-node`.
- Supporting: `execution-interface` as the operational UI path to expose verification outcome workflows.

# 2. Canonical Repo Map

## ACC / Control Plane (canonical target map)

- `acc` → umbrella meta-repo and integration entrypoint (architecture docs, compose manifests, dependency/version matrix, runbooks).
- `acc-core` → orchestration engine (task routing, state machine, policy callouts, lifecycle coordinator).
- `acc-api` → REST control-plane boundary for operators and systems.
- `acc-runner` → worker runtime for executing routed tasks/workflows.
- `acc-web` → operator/admin UI.
- `acc-db` → canonical schema/migrations/reference seed data.
- `acc-workflows` → versioned workflow specs and validation fixtures.
- `acc-adapters` → external connectors (GitHub, identity, LLM, external systems).
- `acc-auth` → authn/authz service and token/claims validation.
- `acc-logs` → audit/event ingestion/query boundary.
- `acc-infra` → IaC, deployment descriptors, environments.

### ACC overlap flags

- `ohi-control-plane` likely overlaps with `acc` + `acc-core` + `acc-api`; should be merged/retired unless it uniquely contains production logic.
- `acc-wp-adapter` may be too narrow to stand alone; likely belongs inside `acc-adapters` unless regulatory isolation is required.

## QR-V (canonical target map)

- `qrv-registry` → source of truth for issued/revoked/expired records and proof anchors.
- `qrv-api` → verification API façade and policy/business-rule evaluation layer.
- `qrv-node` → network/node execution layer for verification propagation and consensus-related operations.
- `issuer-qrv` → issuer workflow service that creates signed/verifiable records.
- `qrv-docs` → protocol, API, and integration documentation.
- `qrv-sdk` → developer libraries for issuer/verifier integration.
- `qrv-agent-demos` → sample implementations and reference flows.
- `qrv-wallet` → end-user credential holder and verification UX.

### QR-V activation order (operational)

1. `issuer-qrv` (issue canonical payload)
2. `qrv-api` (accept verification request)
3. `qrv-registry` (resolve proof/state)
4. `qrv-node` (network-backed verification)
5. return deterministic verification result to consuming interface

# 3. Repo-by-Repo Action Matrix

| Repo | Current likely purpose | Action | Canonical role | Immediate next file/artifact needed | Priority |
|---|---|---|---|---|---|
| `acc` | Umbrella project namespace, mixed docs/integration | **Keep** | Program entrypoint + integration governance | `README.md`, `SYSTEM_MAP.md`, `repo-contract-matrix.yaml`, `.github/workflows/ci.yml` | P0 |
| `acc-core` | Orchestration kernel | **Keep** | Task orchestration/state transitions/policy hooks | `openapi-internal.yaml` (or gRPC proto), `orchestrator-state-machine.md`, `TASK_LIFECYCLE.md` | P0 |
| `acc-api` | External/internal control-plane API | **Keep** | Canonical REST API boundary | `openapi.yaml`, `ERROR_MODEL.md`, `examples/` payloads | P0 |
| `acc-runner` | Task execution worker | **Keep** | Deterministic worker runtime | `runner-contract.yaml`, `heartbeat-schema.json`, `.github/workflows/ci.yml` | P0 |
| `acc-web` | Operator interface | **Keep** | Admin UI for workflows/tasks/policies | `README.md` with route map, `api-client-contract.md`, smoke test spec | P1 |
| `acc-workflows` | Workflow definitions | **Keep** | Versioned workflow spec source | `workflow-spec.schema.json`, `workflows/*.workflow.yaml`, validator CI step | P0 |
| `acc-db` | Data schema/migrations | **Keep** | Canonical persistence schema | `schema.sql`, `migrations/0001_init.sql`, `ERD.md` | P0 |
| `acc-auth` | Identity and authorization | **Keep** | AuthN/AuthZ + token policy | `openapi.yaml`, `claims-schema.json`, `policy-bindings.yaml` | P0 |
| `acc-logs` | Audit/event log boundary | **Keep** | Immutable audit/event store API | `audit-event.schema.json`, `retention-policy.md`, `query-api.yaml` | P0 |
| `acc-adapters` | Third-party connectors | **Keep** | Consolidated adapter library/services | `adapters-manifest.yaml`, `github-adapter/README.md`, contract tests | P1 |
| `acc-infra` | IaC/deployment | **Keep** | Environment provisioning and release topology | `environments/prod/`, `terraform/` or `helm/`, `DEPLOYMENT_RUNBOOK.md` | P0 |
| `acc-wp-adapter` | WordPress-specific adapter | **Merge** into `acc-adapters` | Submodule/adapter package (not standalone repo) | `migration-plan.md` and deprecation notice | P2 |
| `ohi-control-plane` | Legacy/parallel control-plane implementation | **Merge or Archive** (decision in 72h) | Legacy source to harvest only unique logic | `CAPABILITY_DIFF.md`, `MIGRATION_CHECKLIST.md` | P1 |
| `qrv-registry` | Verification registry source of truth | **Keep** | Record/proof state authority | `registry-schema.sql`, `revocation-model.md`, API contract | P0 |
| `qrv-api` | Public verification API | **Keep** | Canonical verification endpoint layer | `openapi.yaml`, `verification-response.schema.json`, conformance tests | P0 |
| `qrv-node` | Network node operations | **Keep** | Node participation and validation execution | `node-protocol.md`, `node-config.schema.json`, health endpoint contract | P0 |
| `qrv-sdk` | Integration client libraries | **Keep** | Reference SDK(s) for API consumption | `sdk-contract-tests/`, versioning policy, quickstart | P1 |
| `qrv-docs` | Documentation hub | **Keep** | Canonical docs and onboarding | `architecture.md`, `api-reference/`, `activation-runbook.md` | P1 |
| `qrv-agent-demos` | Example agents and flows | **Pause** | Non-critical demos during activation | `README.md` with compatibility matrix | P2 |
| `issuer-qrv` | Issuance pipeline | **Keep** | Issuer of signed QR-V records | `issuance-api.yaml`, `issuer-signing-policy.yaml`, end-to-end test fixture | P0 |
| `qrv-wallet` | Holder/verifier UX | **Pause** (unless contractually required now) | User credential wallet | `WALLET_SCOPE.md`, deferred backlog | P2 |
| `execution-interface` | Operational interface and verification portal path | **Keep** | Immediate verification result presentation + execution UX | `integration-contract.md` mapping to `qrv-api` | P1 |
| `identity-service` | Shared identity backend | **Keep** | Cross-system identity primitives | `openapi.yaml`, `subject-linking.schema.json` | P1 |
| `onegodian-llm` | LLM subsystem | **Pause** | Optional augmentation, non-blocking for activation | `BOUNDARY.md` (non-critical dependency declaration) | P2 |
| `onegodian-history-api` | Historical data API | **Pause** | Optional historical query subsystem | `DATA_RETENTION.md` | P2 |
| `onegodian-org` | Org-level assets/config | **Keep** | Governance, org docs, policies | `ORG_STANDARDS.md`, `REPO_OWNERSHIP.yaml` | P1 |
| `onegodian-api` | General API surface | **Merge scope or clarify** | If overlaps ACC API, narrow or retire | `SERVICE_BOUNDARY.md` | P1 |
| `recallcore-runtime` | Runtime memory/recall service | **Pause** (integrate later) | Optional enhancement service | `integration-notes.md` | P2 |

# 4. Missing Contracts

Minimum contracts required for immediate deployability:

## ACC API contracts

- `acc-api/openapi.yaml`
  - `/tasks`, `/tasks/{id}`, `/workflows/{id}/start`, `/policies/evaluate`, `/audit/events`
  - explicit `timestamp_utc` fields in RFC 3339 UTC form (`...Z`)
- `acc-api/components/error.schema.json`
- `acc-api/components/pagination.schema.json`

## Workflow/task schemas

- `acc-workflows/workflow-spec.schema.json`
- `acc-workflows/task-envelope.schema.json`
- `acc-workflows/examples/*.workflow.yaml`

Required fields (minimum):
- `workflow_id`, `workflow_version`, `task_id`, `task_type`, `input`, `retry_policy`, `timeout_seconds`, `created_at_utc`, `scheduled_at_utc`

## Policy decision schema

- `acc-auth/policy-decision.schema.json`
- `acc-auth/policy-bindings.yaml`

Minimum decision payload:
- `decision_id`, `subject`, `action`, `resource`, `effect` (`ALLOW`/`DENY`), `reasons[]`, `evaluated_at_utc`, `policy_version`

## Audit event schema

- `acc-logs/audit-event.schema.json`
- `acc-logs/event-taxonomy.md`

Minimum event fields:
- `event_id`, `event_type`, `actor`, `target`, `correlation_id`, `source_service`, `payload_hash`, `occurred_at_utc`, `recorded_at_utc`

## QR-V verification contracts

- `qrv-api/openapi.yaml`
- `qrv-api/verification-response.schema.json`
- `qrv-registry/registry-record.schema.json`
- `issuer-qrv/issuance-record.schema.json`

Minimum verification response fields:
- `qrvid`, `status` (`VERIFIED`/`INVALID`/`REVOKED`/`EXPIRED`), `issuer_id`, `record_type`, `subject_ref`, `proof_ref`, `verified_at_utc`, `registry_tx_ref`

# 5. Governance / Policy Gap

A dedicated governance specification layer is missing or under-specified.

Recommendation:
- Prefer **no new repo initially**.
- Implement governance artifacts in `onegodian-org` (or `acc` if `onegodian-org` is unavailable as an engineering control point).

Minimum files to add:
- `POLICY_BASELINE.md` (security, compliance, UTC timestamp mandate)
- `SERVICE_OWNERSHIP.yaml` (repo/service owner mapping)
- `CHANGE_CONTROL.md` (release and breaking-change rules)
- `DATA_CLASSIFICATION.md`
- `AUDIT_REQUIREMENTS.md`

When to create a new `governance-specs` repo:
- Only if cross-org governance lifecycle and approvals cannot be managed in `onegodian-org` due to access/control constraints.

# 6. 14-Day Execution Plan

## Day 1–2: Repository triage and boundary lock

- Freeze new repository creation for ACC/QR-V scope.
- Approve keep/merge/archive decisions in the action matrix.
- Produce `SERVICE_BOUNDARY.md` for each P0/P1 repo.
- Decide fate of `ohi-control-plane` and `acc-wp-adapter`.

Deliverables:
- `acc/repo-contract-matrix.yaml`
- `onegodian-org/REPO_OWNERSHIP.yaml`

## Day 3–4: Contract baseline (blocker removal)

- Publish `openapi.yaml` in `acc-api`, `acc-auth`, `qrv-api`.
- Publish schema baselines in `acc-workflows`, `acc-logs`, `qrv-registry`, `issuer-qrv`.
- Add CI contract validation workflow in each P0 repo.

Deliverables:
- `.github/workflows/ci.yml` with schema/openapi lint
- `*_schema.json` and `openapi.yaml` artifacts

## Day 5–6: ACC runtime path activation

- Wire `acc-api` → `acc-core` → `acc-runner` with canonical task envelope.
- Wire policy evaluation call to `acc-auth`.
- Emit immutable audit events to `acc-logs`.

Deliverables:
- end-to-end “start workflow” smoke test
- `acc-workflows/examples/minimal.workflow.yaml`

## Day 7–8: QR-V issuance to verification activation

- Activate flow: `issuer-qrv` issues record → `qrv-registry` persists → `qrv-api` verifies.
- Connect `execution-interface` to `qrv-api` contract and verify deterministic status rendering.

Deliverables:
- verification conformance tests
- `qrv-api/examples/verify-success.json`, `verify-revoked.json`

## Day 9–10: Infra + observability hardening

- Align `acc-infra` deployment descriptors with active services only.
- Enable correlation IDs across ACC and QR-V API boundaries.
- Validate UTC timestamp enforcement through automated tests.

Deliverables:
- `DEPLOYMENT_RUNBOOK.md`
- log/audit dashboards or query scripts

## Day 11–12: Consolidation execution

- Migrate or archive `acc-wp-adapter` into `acc-adapters`.
- Extract unique logic from `ohi-control-plane`; archive remainder.
- Pause non-critical repos (`qrv-agent-demos`, `qrv-wallet`, `onegodian-llm`, `recallcore-runtime`) with explicit status docs.

Deliverables:
- archive notices
- migration PRs with capability diffs

## Day 13–14: Production readiness gate

- Run contract conformance and cross-repo smoke tests.
- Conduct architecture review focused on fragmentation and ownership clarity.
- Issue go/no-go with explicit dependency checklist.

Deliverables:
- `ACTIVATION_READINESS_REPORT.md`
- signed decision log in `onegodian-org`

# 7. Immediate Recommended Decisions

1. **Ratify canonical ACC map immediately** and declare `acc-api` as the only external control-plane API.
2. **Enforce QR-V activation path now**: `issuer-qrv → qrv-api → qrv-registry → qrv-node` and block side paths until conformance passes.
3. **Treat `ohi-control-plane` as a 72-hour disposition item**: merge unique capabilities or archive.
4. **Merge `acc-wp-adapter` into `acc-adapters`** unless legal/compliance requires isolation.
5. **Mandate UTC contract fields in every P0 repo**; reject PRs missing `*_at_utc` fields.
6. **Pause P2 repositories for 14 days** to reduce coordination overhead and fragmentation.
7. **Gate deployment on contract artifacts first** (`openapi.yaml`, schemas, CI validation), not on feature breadth.
