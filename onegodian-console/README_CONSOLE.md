# OneGodian Console

Domain: https://console.onegodian.com

## Purpose

The OneGodian Console is the internal operator and command/control plane for the OneGodian ecosystem.

It manages ACC, agents, tasks, workflows, OCP authorization, OEG execution routing, adapters, approvals, audit records, logs, policies, settings, and operational status.

## Allowed Areas

- /admin
- /dashboard
- /agents
- /tasks
- /workflows
- /ocp
- /oeg
- /adapters
- /approvals
- /audit
- /logs
- /settings
- /status
- /api/health
- /api/manifest
- /api/agents
- /api/tasks
- /api/workflows
- /api/ocp
- /api/oeg
- /api/audit

## Authority Rule

The Console follows the governed execution spine:

ACC → OCP → OEG → Adapter / Runner

No autonomous agent may self-authorize privileged action.

Privileged actions must pass through OCP authorization and produce deterministic decision records.

## Rule

Console = internal command, authorization, execution, monitoring, audit, and operator control.
