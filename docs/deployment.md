# Algonquian Deal Marketplace Deployment Guide

## Pre-deployment checklist

- Confirm target WordPress and PHP versions meet the site baseline for the ARE suite.
- Confirm `algq-core` is installed and active before installing Deal Marketplace.
- Confirm the deployment user can install plugins, activate plugins, manage options, and flush permalinks.
- Back up the WordPress database and `wp-content/plugins` directory.
- Export existing role/capability assignments if the site uses custom buyer or investor roles.
- Review the target environment for optional integrations: Deal Intake, Pipeline CRM, Buyer Portal, Document Library, Digital Store, WooCommerce Bridge, and Command Center.
- Run syntax checks and the PHPUnit smoke suite before packaging.
- Confirm no production-only secrets or local artifacts are included in the plugin directory.

## Zip packaging

Package the plugin from the ARE plugins directory so the archive root is `algq-marketplace/`:

```bash
cd algonquian-real-estate/plugins
zip -r algq-marketplace.zip algq-marketplace \
  -x '*/.DS_Store' \
  -x '*/node_modules/*' \
  -x '*/vendor/*' \
  -x '*/tests/.phpunit.result.cache'
```

Validate the archive before upload:

```bash
unzip -l algq-marketplace.zip | head
```

The first path entries should begin with `algq-marketplace/`, not `plugins/algq-marketplace/` and not loose plugin files.

## WordPress upload/install steps

1. Sign in to WordPress as an administrator.
2. Go to **Plugins → Add New → Upload Plugin**.
3. Upload `algq-marketplace.zip`.
4. Click **Install Now**.
5. Confirm WordPress extracts the plugin as `wp-content/plugins/algq-marketplace/`.
6. Do not activate until `algq-core` is active.

For command-line deployments, copy or unzip the plugin into `wp-content/plugins/algq-marketplace/`, then use WP-CLI activation from the WordPress root:

```bash
wp plugin activate algq-core
wp plugin activate algq-marketplace
```

## Activation steps

Activation runs the plugin activator, which:

1. Installs marketplace capabilities.
2. Creates marketplace database tables.
3. Creates or links the default `/deal-marketplace/` page.
4. Adds default options with private access mode.
5. Flushes rewrite rules.

After activation, open **Plugins** and verify **Algonquian Deal Marketplace** is active with the expected version.

## Generated page verification

- Open **Pages** and find **Deal Marketplace**.
- Confirm the slug is `deal-marketplace`.
- Confirm the page content contains `[algq_marketplace]`.
- Confirm the page is published unless the deployment plan requires a draft/private status.
- Visit `/deal-marketplace/` while signed in as an authorized marketplace user.
- Confirm unauthorized users see the access message instead of listing details.

## Permalink refresh

Activation flushes rewrite rules, but production deployments should still verify permalink health:

1. Go to **Settings → Permalinks**.
2. Click **Save Changes** without changing the structure.
3. Revisit `/deal-marketplace/`.
4. Revisit `/wp-json/algq/v1/marketplace`.

With WP-CLI:

```bash
wp rewrite flush
```

## Role/capability verification

Verify the following grants after activation:

- `administrator` has `algq_manage_deal_marketplace`, `algq_view_deal_marketplace`, `algq_submit_deal_interest`, and `algq_manage_deal_ndas`.
- `subscriber` has `algq_view_deal_marketplace` and `algq_submit_deal_interest` by default.
- If the site requires vetted buyers only, remove default subscriber access and grant view/submit capabilities to approved buyer or investor roles.
- Confirm users who manage NDA operations have `algq_manage_deal_ndas`.

WP-CLI examples:

```bash
wp cap list administrator | grep algq_
wp cap list subscriber | grep algq_
```

## Shortcode smoke test

Create a temporary draft page or use the generated page and verify:

- `[algq_marketplace]` renders the marketplace heading for an authorized user.
- `[algq_deal_marketplace]` renders the same marketplace output.
- Public CSS and JS enqueue only when the shortcode renders.
- Unauthorized visitors receive the sign-in/access message.
- The page does not emit PHP notices, warnings, or fatal errors.

## Admin screen smoke test

- Open **Deal Marketplace** in the WordPress admin.
- Confirm the screen is visible to an administrator or user with `algq_manage_deal_marketplace`.
- Confirm a user without management capability cannot open the screen.
- Confirm marketplace modules/listings render in the admin table.
- Confirm optional integration notices are informational and do not block normal operation.
- Confirm the `algq_deal_marketplace_options` setting sanitizes `access_mode` to `private`, `members`, or `public`.

## Rollback plan

1. Confirm database backup is available.
2. Deactivate **Algonquian Deal Marketplace**.
3. Replace `wp-content/plugins/algq-marketplace/` with the previous known-good version.
4. Reactivate the previous version.
5. Flush permalinks.
6. Verify generated page, shortcode, admin screen, and REST endpoint.
7. If a database migration caused the issue, restore the pre-deployment database backup in staging first, then production after approval.

Do not delete marketplace tables during an ordinary rollback unless the rollback plan explicitly includes data restoration.

## Uninstall policy

The plugin deactivation path does not remove marketplace tables, pages, options, audit records, NDA records, or buyer interest records. This protects operational and compliance data.

Uninstall/data deletion should be a separate, explicit administrative decision that includes:

- Exporting buyer interest records.
- Exporting NDA acceptance records and audit logs.
- Confirming legal/compliance retention requirements.
- Removing generated pages only after confirming no active navigation depends on them.
- Removing custom role/capability grants only after confirming no other ARE module uses them.
