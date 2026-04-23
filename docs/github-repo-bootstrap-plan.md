# GitHub Repository Bootstrap Plan (OHI Stack)

## Purpose
This playbook unblocks execution when repository creation is not available in the current tool session. It defines exactly what to create in GitHub first, then what to scaffold immediately after each repository exists.

## Repositories to Create
Create these repositories under the `ohi-stack` organization:

1. `u-onegodian-org`
2. `onegodian-university-lms`
3. `onegodian-members-plugin`

## Repository Purpose Definitions

### `u-onegodian-org`
Use this repository for:
- WordPress deployment documentation for `u.onegodian.org`
- University IA and page mapping
- LMS integration documentation
- Environment matrix documentation
- Migration planning from Tutor LMS

### `onegodian-university-lms`
Use this repository for:
- Tutor LMS replacement plugin implementation
- Plugin source code
- Data schema design
- Migration tooling
- Shortcodes and UI hooks
- Certificate flows
- Payments and enrollment logic
- Zoom/live classes integration

### `onegodian-members-plugin`
Use this repository for:
- Identity + membership + access control
- OHSID logic
- Tier and role system
- Member dashboard capabilities
- Content locking
- WooCommerce/Stripe membership flows

## Immediate Baseline for All Repositories
Create the following in each repository right after creation:

- `README.md`
- `.gitignore`
- `.editorconfig`
- `docs/`
- `.env.example`
- `CHANGELOG.md`
- `LICENSE` (optional)
- `.github/workflows/` (for upcoming CI)

## Suggested Initial Structures

### `onegodian-university-lms`
```text
onegodian-university-lms/
  README.md
  CHANGELOG.md
  .env.example
  docs/
    architecture.md
    roadmap.md
    migration-plan.md
  plugin/
  tests/
```

### `onegodian-members-plugin`
```text
onegodian-members-plugin/
  README.md
  CHANGELOG.md
  .env.example
  docs/
    feature-spec.md
    identity-model.md
    monetization.md
  plugin/
  tests/
```

### `u-onegodian-org`
```text
u-onegodian-org/
  README.md
  CHANGELOG.md
  .env.example
  docs/
    site-architecture.md
    page-map.md
    lms-integration.md
    deployment-runbook.md
```

## Post-Creation Execution Checklist
After repositories exist, execute this sequence in each repo:

1. Add starter `README.md` content.
2. Add architecture docs and implementation roadmap.
3. Add `.env.example` with environment variable placeholders.
4. Add runbooks for operations/deployment.
5. Add folder scaffolds (`plugin/`, `tests/`, `docs/`).
6. Open first PR with skeleton files.
7. Begin plugin/module implementation in small reviewable increments.

## Notes on Current Blocker
Current blocker is tool-surface capability: planning is complete, but repository creation must be done through GitHub UI/API path that supports `create-repository` for the session.
