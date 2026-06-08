# Release Checklist

- Confirm PHP syntax checks pass for all plugin PHP files.
- Confirm every PHP file blocks direct access with `ABSPATH` or `WP_UNINSTALL_PLUGIN`.
- Confirm settings, admin actions, AJAX, NDA, buyer interest, and bulk actions verify nonces.
- Confirm all incoming fields are sanitized and status/visibility/access fields use allowlists.
- Confirm frontend and admin output is escaped.
- Confirm activation creates tables, roles, options, and generated pages.
- Confirm deactivation flushes rewrites without deleting data.
- Confirm uninstall cleanup is controlled by settings before deleting generated pages or tables.
