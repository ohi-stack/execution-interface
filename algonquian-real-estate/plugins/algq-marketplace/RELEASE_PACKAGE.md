# Algonquian Deal Marketplace Release Package

## Version number

1.0.1

## Release date

2026-06-01

## Structure validation

Initial production-package validation found the runtime plugin in `plugins/algq-marketplace` with the WordPress text domain and runtime identifiers for `algq-deal-marketplace`. Before packaging, the release structure was completed so the package contains:

- Main plugin bootstrap file: `algq-marketplace.php`
- `README.md`
- `CHANGELOG.md`
- `RELEASE_VALIDATION.md`
- `RELEASE_PACKAGE.md`
- `uninstall.php`
- `assets/`
- `includes/`
- `templates/`
- `docs/`

Items missing before release preparation and added for the production package:

- `CHANGELOG.md`
- `templates/`
- `docs/`

## Package contents

The production archive is generated as `algq-deal-marketplace-1.0.1-production.zip` during release assembly and is intentionally not committed to source control. The ZIP root contains exactly one plugin folder:

```text
algq-deal-marketplace/
```

The plugin folder includes the WordPress runtime and release documentation:

- `algq-marketplace.php`
- `uninstall.php`
- `README.md`
- `CHANGELOG.md`
- `RELEASE_VALIDATION.md`
- `RELEASE_PACKAGE.md`
- `assets/`
- `includes/`
- `templates/`
- `docs/`

## Validation performed

- PHP syntax validation was run across all plugin PHP files.
- Lightweight bootstrap validation was run with WordPress shims.
- Activation hook registration was confirmed in the shimmed bootstrap.
- Shortcode registration for `[algq_marketplace]` and `[algq_deal_marketplace]` was confirmed after plugin bootstrap and `init` execution.
- Optional Algonquian Real Estate suite plugins were intentionally left inactive in the shimmed bootstrap, and the plugin loaded without fatal errors.
- PHPUnit was checked but was not installed in the execution environment.
- The production ZIP structure was validated to confirm there are no loose files at the ZIP root.
- A SHA-256 checksum was generated for the production ZIP during packaging.
- Generated ZIP and checksum artifacts were left out of git so the branch remains push-safe; rebuild them from the release packaging command when cutting the distributable.

## Excluded files

Generated release archives and checksums are also excluded from source control and should be created by the release packaging step. The production archive intentionally excludes development and non-runtime artifacts, including:

- `.git/`
- `.github/`
- `node_modules/`
- Composer/vendor caches
- `tests/`
- `phpunit.xml.dist`
- test caches
- coverage reports
- temporary build directories
- OS metadata such as `.DS_Store`
- editor settings
- screenshots not required at runtime
- product mockups
- binary marketing assets

## Installation instructions

1. In WordPress admin, go to **Plugins > Add New > Upload Plugin**.
2. Upload `algq-deal-marketplace-1.0.1-production.zip`.
3. Install and activate **Algonquian Deal Marketplace**.
4. Confirm the marketplace page and shortcodes are available.
5. Review **Deal Marketplace** admin settings, especially cache and uninstall behavior.

## Upgrade instructions

1. Back up the WordPress database and plugin files.
2. Confirm the current production site is not actively processing marketplace submissions.
3. Upload and install `algq-deal-marketplace-1.0.1-production.zip` through WordPress admin or deploy the `algq-deal-marketplace/` folder through the normal release pipeline.
4. Activate or reactivate the plugin if needed.
5. Clear marketplace cache from the Deal Marketplace admin screen.
6. Validate public marketplace rendering and admin dashboard access.

## Rollback instructions

1. Deactivate Algonquian Deal Marketplace.
2. Restore the previous plugin folder or reinstall the previous release archive.
3. Restore the database backup only if rollback requires reverting marketplace table or option changes.
4. Reactivate the previous plugin version.
5. Validate shortcodes, generated pages, and admin access.

## Uninstall behavior

Uninstall is non-destructive by default. Marketplace tables and generated options are deleted only when an administrator explicitly enables **Delete marketplace tables and generated options during uninstall** before uninstalling the plugin.

## Release notes

Version 1.0.1 is a production packaging release. It fixes fatal syntax issues in the bootstrap, admin cache handler, and renderer; updates the public plugin version to 1.0.1; adds release documentation; and documents a push-safe packaging process that keeps generated ZIP/checksum artifacts out of git while packaging only runtime and documentation files needed for WordPress upload compatibility.

## Known limitations

- PHPUnit was not available in the packaging environment, so automated PHPUnit smoke tests were not executed there.
- Full WordPress database writes, REST dispatch, generated page creation, role persistence, and browser-based UI validation still require a disposable staging WordPress environment.
- Optional Algonquian suite plugins are integration points; this package validates the plugin loads when those optional plugins are inactive but does not validate every suite-enabled workflow.
- The release archive uses the production upload folder `algq-deal-marketplace/` while the bootstrap file remains `algq-marketplace.php` for backward compatibility.
