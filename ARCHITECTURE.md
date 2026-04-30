# Execution Interface Architecture

## Purpose

The execution-interface repository defines a reusable, auditable execution boundary for structured workflows.

It is not a product-specific implementation and it must not contain client-specific business logic. The repository exists to define the contracts, invariants, and package boundaries that other systems may use to process intake, evaluate rules, produce decisions, and record audit evidence.

## Architectural Sequence

The canonical flow is:

```text
Intake -> Validation -> Rules -> Decision -> Audit -> Execution Boundary
```

Execution is intentionally outside the evaluation layer. No module may perform side effects unless a later execution boundary explicitly authorizes them.

## Layer Responsibilities

### Intake

Defines the canonical input structure for execution requests.

Allowed:
- intake metadata
- payload containers
- intent declarations
- structural schema definitions

Forbidden:
- rule evaluation
- business-specific interpretation
- side effects
- external service calls

### Validation

Determines whether an intake request is admissible.

Allowed:
- deterministic invariant checks
- refusal reasons for malformed input
- type and structure checks

Forbidden:
- final decisions
- workflow execution
- audit persistence
- external service calls

### Rules

Defines pure predicates over validated intake.

Allowed:
- rule interfaces
- rule result contracts
- deterministic condition checks

Forbidden:
- final approval or refusal authority
- mutation of intake
- external side effects
- database writes

### Decisions

Normalizes rule results into explicit outcomes.

Allowed outcomes:
- approve
- refuse
- review

Decisions must be immutable and machine-readable.

Forbidden:
- execution
- notification delivery
- payment activity
- database mutation
- external service calls

### Audit

Defines evidence records that describe what was evaluated and what outcome was produced.

Allowed:
- audit event contracts
- trace contracts
- decision linkage
- timestamp fields

Forbidden:
- modifying prior events
- deciding outcomes
- executing workflows
- calling external systems directly

### Configuration

Defines runtime limits and policy boundaries.

Allowed:
- execution modes
- side-effect policy declarations
- runtime limits
- environment labels

Forbidden:
- embedded credentials
- client-specific business logic
- hidden execution behavior

## Non-Negotiable Principles

1. Reusable infrastructure over one-off scripts.
2. Configuration over customization.
3. Interfaces over personalities.
4. Refusal is a first-class outcome.
5. Audit records must be deterministic and replayable.
6. Side effects require explicit execution-boundary authorization.
7. No client-specific logic belongs in the core.

## Adapter Boundary

External systems must be connected through adapters, not embedded into the core.

An adapter may connect to:
- execution gateways
- identity systems
- WordPress
- databases
- third-party APIs

Adapters must be replaceable. If an adapter cannot be swapped without rewriting the core, it does not belong in this repository.

## Version Status

Current status: v0.1 architectural foundation.

This version defines the evaluation contract only. Production execution, persistence, user interfaces, and external integrations belong in downstream systems.
