# Contributing

## Workflow

1. Pick a task from `roadmap/backlog.md`.
2. Keep each pull request focused on one plugin or one workflow area.
3. Run PHP syntax validation before submitting changes.
4. Update documentation when adding shortcodes, database tables, or settings.

## WordPress standards

- Prefix PHP functions, classes, options, nonces, actions, and filters with `algq_` or `ALGQ_`.
- Escape output with WordPress escaping helpers.
- Sanitize request input before use.
- Verify nonces on form submissions and AJAX endpoints.
- Store module-specific code inside its plugin directory.
