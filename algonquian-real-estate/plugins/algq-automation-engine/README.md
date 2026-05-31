# Algonquian Automation Engine

Production automation module for trigger/action workflows.

## Features

- Trigger/action rules stored in `algq_automation_rules`.
- Status-based automations for deal creation, stage changes, offer sent, buyer interest, funding committed, document signed, and deal closed.
- Action types for email notifications, document generation triggers, task creation, status updates, admin notifications, and closeout workflows.
- Run history in `algq_automation_runs` for auditability.
- WordPress action bridge via `do_action('algq_automation_trigger', $trigger, $payload)`.
- REST endpoints under `/wp-json/algq/v1/automations` and `/wp-json/algq/v1/automations/trigger`.
