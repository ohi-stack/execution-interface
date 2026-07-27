# OneGodian Domain Separation Policy

## Purpose

The OneGodian ecosystem uses strict domain separation to preserve clarity, compliance, security, and institutional readability.

## Domain Roles

### OneGodian.org

Purpose: identity, education, philosophy, institutional explanation, public narrative, and community-facing information.

Function Type: informational / expressive / educational / community-oriented.

### OneGodian.com

Purpose: commerce, products, services, payments, monetization, and transactional activity.

Function Type: commercial / transactional.

### app.OneGodian.com

Purpose: public and member-facing application layer.

Function Type: application / dashboard / tools / registry viewing / user interaction.

### console.OneGodian.com

Purpose: internal command and control plane.

Function Type: admin / operator / agent control / authorization / workflow execution / audit / logs / policy management.

## Separation Rule

If it is identity, education, philosophy, or public explanation, it belongs on OneGodian.org.

If it involves commerce, payments, products, services, or monetization, it belongs on OneGodian.com.

If it is a public or member-facing app feature, it belongs on app.OneGodian.com.

If it is internal control, administration, agent execution, authorization, audit, policy, logs, adapters, or kill-switch logic, it belongs on console.OneGodian.com.

## App vs Console Rule

App = experience.

Console = control.

The App must not contain privileged operator functions.

The Console must not be treated as a public user application.

## Security Requirements

- Console must require authenticated operator access.
- Console must be noindex/noarchive.
- Console must not expose privileged APIs publicly.
- Privileged actions must pass through authorization.
- Decision records must be logged.
- Audit records must not be altered or deleted.
- App may expose public-safe read-only APIs only.

## Final Statement

The OneGodian App and OneGodian Console are separate operational surfaces.

app.OneGodian.com serves the user and member experience.

console.OneGodian.com governs internal execution, authorization, agents, workflows, policies, logs, audits, and operational control.
