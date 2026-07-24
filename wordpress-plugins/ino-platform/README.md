# INO Platform WordPress Plugin

Version 0.1.0 establishes the foundation for a modular INO Platform plugin. It includes:

- Core bootstrap, activation/deactivation hooks, roles, capabilities, admin shell, shortcodes, and branded assets.
- Modules for membership, identity, genealogy, BuddyPress/BuddyBoss community compatibility, treasury/grants, housing, governance, certificates, volunteers, and forms.
- REST namespace `ino-platform/v1` with status, module discovery, and per-module list/create endpoints.
- Security defaults: authenticated member endpoints, module capabilities, private records, restricted metadata, sanitization, and an ancestry review guard helper.

## Installation

Copy `wordpress-plugins/ino-platform` into `wp-content/plugins/ino-platform`, activate **INO Platform**, then review the generated dashboard/intake/governance pages.

## Release package

Run:

```bash
scripts/package-ino-platform.sh
```

The 0.1.0 zip is written to `dist/ino-platform-v0.1.0.zip`.
