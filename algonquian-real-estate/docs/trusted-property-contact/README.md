# Trusted Property Contact

Trusted Property Contact is the platform's property stewardship and coordination module. It manages homeowner authorizations, properties, recurring visits, maintenance, vendor work, emergency escalation, secure communications, reports, and an immutable activity history.

## Operating boundary

ARE acts only within the current written authorization for a property. The module does not make ARE an attorney, trustee, executor, conservator, guardian, financial adviser, or power of attorney. Work above the authorization's approval threshold cannot be scheduled without recorded owner approval.

## Integration

The module boots from `plugins/algq-platform/algq-platform.php`, uses the platform activation lifecycle for tables, roles, scheduled rules, and generated pages, and exposes seven shortcodes. Stewardship documents use WordPress attachment IDs and protected download responses so the existing Document Library/PDF layer can generate and retain files without publishing storage URLs.

See [data model](data-model.md), [permissions](permissions.md), [workflows](workflows.md), [shortcodes](shortcodes.md), and [security and scope](security-and-scope.md).
