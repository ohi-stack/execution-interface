# Algonquian Marketplace

The Marketplace module introduces ARE monetization and distribution foundations for buyer-facing deal inventory.

## Capabilities

- Wholesale deals — curated off-market deal rooms and assignment opportunities.
- Investor access — gated investor and capital partner visibility.
- Deal syndication — distribution workflows for qualified private channels.
- Buyer subscriptions — recurring membership tiers for priority deal access.
- Premium listings — featured inventory placement with enhanced deal context.

## Shortcode

```text
[algq_marketplace]
```

## REST endpoint

```text
GET /wp-json/algq/v1/marketplace
```

## Generated pages

Activation declares and creates the public ARE Marketplace page when a WordPress environment is available:

- `are-marketplace` — renders `[algq_marketplace]`

## Release validation

See [`RELEASE_VALIDATION.md`](RELEASE_VALIDATION.md) for the final production-hardening checklist covering PHP lint, PHPUnit smoke testing, activation, generated pages, shortcodes, buyer flows, marketplace listings, deal detail access, NDA gates, interested-buyer submission, admin dashboard, cache clearing, optional suite-plugin inactivity, and uninstall behavior.

Uninstall is non-destructive by default. Marketplace tables and generated options are deleted only when an administrator explicitly enables **Delete marketplace tables and generated options during uninstall** before uninstalling.

## PHPUnit tests

The plugin includes a safe PHPUnit suite in `tests/` with `phpunit.xml.dist`. The suite is designed to avoid production database access and external network calls.

### Install the WordPress test suite

The tests can run in two modes:

1. **Lightweight shim mode** — no WordPress test suite is required. The bootstrap registers small WordPress function shims so plugin loading, shortcodes, capabilities, sanitization, activation declarations, and generated page definitions can be verified safely.
2. **Full WordPress mode** — install the official WordPress test suite and set `WP_TESTS_DIR` to its path before running PHPUnit.

A typical local WordPress test-suite setup is:

```bash
svn co https://develop.svn.wordpress.org/trunk/ /tmp/wordpress-develop
cd /tmp/wordpress-develop
bash bin/install-wp-tests.sh wordpress_test root '' localhost latest
export WP_DEVELOP_DIR=/tmp/wordpress-develop
export WP_TESTS_DIR=/tmp/wordpress-develop/tests/phpunit
```

Adjust the database name, user, password, and host for your local development machine. Do not point the WordPress test suite at a production database.

### Run PHPUnit

From this plugin directory:

```bash
phpunit -c phpunit.xml.dist
```

If PHPUnit is installed through Composer in a parent project, use that binary instead, for example:

```bash
../../vendor/bin/phpunit -c phpunit.xml.dist
```

### What the suite verifies

- The main plugin file exists and loads without fatal errors.
- Required plugin constants are defined.
- Core plugin, activation, and sanitization classes exist after bootstrap.
- The `[algq_marketplace]` shortcode is registered and renders expected markup.
- Marketplace capabilities are declared for administrator, marketplace manager, and investor roles.
- Sanitization helpers return safe text, keys, URLs, and textarea values.
- The activation class and `activate()` method exist.
- Generated page definitions are available and include the marketplace shortcode page.

### What is intentionally not tested without full WordPress

In lightweight shim mode, tests intentionally do not exercise real database writes, role persistence, REST dispatch through WordPress core, page creation through `wp_insert_post()`, or interactions with other production plugins. Those behaviors should be covered in a full WordPress test environment or staging site with disposable data.
