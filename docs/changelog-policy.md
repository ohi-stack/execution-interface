# Algonquian Deal Marketplace Changelog Policy

## Purpose

The changelog provides operators, developers, and compliance reviewers with a readable history of marketplace changes. It should make upgrades predictable by clearly documenting functional changes, security fixes, database changes, integration changes, and operational notes.

## Format

Use a reverse-chronological changelog with one section per released version:

```markdown
## [1.1.0] - 2026-06-01

### Added
- New buyer access workflow.

### Changed
- Updated marketplace listing query strategy.

### Fixed
- Corrected shortcode access message escaping.

### Security
- Tightened NDA download capability checks.

### Database
- Added an index for active listing queries.

### Integrations
- Added Pipeline CRM handoff metadata.

### Upgrade notes
- Flush permalinks after activation.
```

Only include headings that have entries for that release.

## Required entries

Every release should include:

- Version number.
- Release date in `YYYY-MM-DD` format.
- Summary of user-facing changes.
- Security notes, if any.
- Database migration notes, if any.
- Integration behavior changes, if any.
- Manual post-deployment steps, if any.

## Categories

Use these categories consistently:

- **Added** for new features, screens, shortcodes, endpoints, tables, or integrations.
- **Changed** for behavior changes, UI changes, performance changes, or dependency changes.
- **Deprecated** for supported functionality scheduled for removal.
- **Removed** for removed functionality.
- **Fixed** for bug fixes.
- **Security** for nonce, capability, escaping, sanitization, access-control, upload/download, or data-protection fixes.
- **Database** for schema, index, migration, or data-retention changes.
- **Integrations** for changes involving ARE suite plugins or third-party systems.
- **Upgrade notes** for required operator actions.

## Security disclosure language

Security entries should be clear without exposing exploit instructions. Include:

- The affected surface, such as shortcode render, admin screen, interest submission, NDA gate, REST route, upload, or download.
- The type of mitigation, such as nonce check, capability check, escaping, sanitization, prepared query, or stricter file validation.
- Whether operators must take action.

Avoid publishing payloads, private vulnerability reports, or sensitive buyer/deal data.

## Database and retention notes

Document any change that affects:

- `algq_deal_marketplace_listings`.
- `algq_deal_marketplace_interests`.
- `algq_deal_marketplace_ndas`.
- `algq_deal_marketplace_audit_log`.
- Generated pages or options.
- Role/capability grants.

If a release changes retention behavior for NDA, interest, or audit records, call it out under both **Database** and **Upgrade notes**.

## Pre-release changelog review

Before packaging:

- Confirm the changelog version matches the plugin header and constants.
- Confirm the changelog date matches the intended release date.
- Confirm all breaking changes and manual steps are visible.
- Confirm security fixes are documented at the right level of detail.
- Confirm integration changes name affected optional plugins.
