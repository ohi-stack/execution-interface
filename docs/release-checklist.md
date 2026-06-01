# Algonquian Deal Marketplace Release Checklist

Use this checklist before packaging and deploying a marketplace release.

## Version bump

- [ ] Update the plugin header version in `algq-marketplace.php`.
- [ ] Update `ALGQ_DEAL_MARKETPLACE_VERSION`.
- [ ] Update any legacy compatibility version constants if the release affects legacy consumers.
- [ ] Confirm asset URLs use the new version for cache busting.

## Changelog update

- [ ] Add an entry following `docs/changelog-policy.md`.
- [ ] Include user-facing changes, security fixes, database changes, integration changes, and known upgrade notes.
- [ ] Confirm the changelog date matches the release date.

## Syntax check

Run syntax checks for changed PHP files:

```bash
find algonquian-real-estate/plugins/algq-marketplace -name '*.php' -print0 | xargs -0 -n1 php -l
```

- [ ] No PHP syntax errors.
- [ ] No accidental debug output.
- [ ] No local-only file paths or secrets.

## PHPUnit smoke test

From the plugin directory:

```bash
cd algonquian-real-estate/plugins/algq-marketplace
phpunit -c phpunit.xml.dist
```

- [ ] Plugin load tests pass.
- [ ] Capability tests pass.
- [ ] Shortcode tests pass.
- [ ] Sanitization tests pass.
- [ ] Activation/generation tests pass.

## Manual activation test

On staging:

- [ ] `algq-core` is active before marketplace activation.
- [ ] Activation completes without fatal errors.
- [ ] Database tables are created.
- [ ] Default options are created.
- [ ] Rewrite rules are flushed.
- [ ] Deactivation and reactivation do not duplicate pages or corrupt data.

## Generated page test

- [ ] `/deal-marketplace/` page exists.
- [ ] Page content contains `[algq_marketplace]`.
- [ ] Page renders for authorized marketplace users.
- [ ] Unauthorized users receive the access-control message.
- [ ] Permalinks are refreshed after activation.

## Shortcode test

- [ ] `[algq_marketplace]` renders expected markup.
- [ ] `[algq_deal_marketplace]` renders equivalent markup.
- [ ] Assets enqueue only on shortcode pages.
- [ ] No browser console errors.
- [ ] Output is escaped and does not leak private metadata.

## Admin settings test

- [ ] **Deal Marketplace** admin menu appears for marketplace managers.
- [ ] Unauthorized users cannot access the admin screen directly.
- [ ] Admin table renders listings or fallback modules.
- [ ] `access_mode` accepts only `private`, `members`, or `public`.
- [ ] Optional integration notice is accurate.

## Cache clear test

- [ ] Clear-cache action exists if included in the release.
- [ ] Clear-cache action requires management capability.
- [ ] Clear-cache action verifies a nonce.
- [ ] Integration cache refreshes after optional plugin activation/deactivation.
- [ ] Listing cache refreshes after listing updates if listing caching is enabled.

## Uninstall safety review

- [ ] Deactivation does not delete listings, interests, NDAs, audit logs, generated pages, or options.
- [ ] Any uninstall/delete-data path is explicit and documented.
- [ ] Legal/compliance retention expectations for NDA and audit records are reviewed.
- [ ] Rollback plan has been tested on staging.

## Zip packaging

From `algonquian-real-estate/plugins`:

```bash
zip -r algq-marketplace.zip algq-marketplace \
  -x '*/.DS_Store' \
  -x '*/node_modules/*' \
  -x '*/vendor/*' \
  -x '*/tests/.phpunit.result.cache'
```

- [ ] Archive root is `algq-marketplace/`.
- [ ] Archive excludes local caches and dependency directories not needed for runtime.
- [ ] Archive installs cleanly through WordPress plugin upload.
- [ ] Uploaded plugin version matches release notes.
