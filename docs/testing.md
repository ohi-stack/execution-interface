# Algonquian Deal Marketplace Testing Guide

## PHPUnit setup

The plugin includes `phpunit.xml.dist` and tests under `algonquian-real-estate/plugins/algq-marketplace/tests/`.

From the plugin directory:

```bash
cd algonquian-real-estate/plugins/algq-marketplace
phpunit -c phpunit.xml.dist
```

If PHPUnit is installed through Composer in a parent project, run the local binary instead:

```bash
../../vendor/bin/phpunit -c phpunit.xml.dist
```

The test bootstrap supports a lightweight shim mode for safe plugin-load, shortcode, capability, activation, and sanitization tests without connecting to a production database. For full WordPress integration testing, install the WordPress test suite, set `WP_DEVELOP_DIR` and `WP_TESTS_DIR`, and point the test suite only at disposable test data.

## Test suite scope

Automated tests should cover:

- Main plugin file existence and load safety.
- Required constants and classes.
- Activation class and generated page definitions.
- Capability declarations and expected role grants.
- Shortcode registration and expected render structure.
- Sanitization helpers for text, keys, URLs, emails, and textarea-style values where present.
- Legacy compatibility APIs that older ARE consumers may call.

Automated tests in shim mode intentionally should not cover production database writes, live REST dispatch through WordPress core, external network calls, or real role persistence. Use a disposable WordPress test database or staging site for those checks.

## Manual QA checklist

- Activate the plugin on a staging site with `WP_DEBUG` enabled.
- Confirm activation completes without fatal errors.
- Confirm generated tables exist with the expected names and indexes.
- Confirm `/deal-marketplace/` exists and contains the shortcode.
- Confirm an authorized user can view marketplace cards.
- Confirm an unauthorized user sees only the access-control message.
- Confirm the admin screen renders for authorized users.
- Confirm optional integration notices appear only to marketplace managers.
- Confirm deactivation does not delete data.
- Confirm reactivation does not duplicate generated pages.

## Browser QA checklist

Test the generated marketplace page in current Chrome, Safari, Firefox, and Edge where possible:

- Desktop width.
- Tablet width.
- Mobile width.
- Signed-in authorized buyer.
- Signed-in unauthorized user.
- Signed-out visitor.
- High-contrast or reduced-motion browser settings if supported.
- Browser console free of JavaScript errors.
- Network panel confirms marketplace assets load successfully only on pages using the shortcode.

## Security checks

- Verify buyer interest submissions require the marketplace nonce.
- Verify buyer interest submissions require `algq_submit_deal_interest`, marketplace management capability, or `manage_options`.
- Verify admin screen access requires `algq_manage_deal_marketplace` or `manage_options`.
- Verify all user-controlled output is escaped with the appropriate WordPress escaping helper.
- Verify database writes use `$wpdb` format arrays or prepared SQL.
- Verify NDA acceptance stores hashed IP data rather than raw IP data.
- Verify confidential deal details are not shown without buyer access and NDA acceptance where applicable.
- Verify REST output contains status metadata only and does not leak private deal details.

## Shortcode checks

- `[algq_marketplace]` renders the ARE Deal Marketplace section for authorized users.
- `[algq_deal_marketplace]` renders equivalent output.
- Shortcodes enqueue `deal-marketplace.css` and `deal-marketplace.js` when rendered.
- Shortcodes do not enqueue public assets on unrelated pages.
- Shortcodes escape listing titles, descriptions, and statuses.
- Shortcodes return a clear access message for unauthorized users.

## Admin checks

- **Deal Marketplace** menu appears for authorized managers.
- Menu does not appear for unauthorized users.
- Admin table lists active listings or fallback marketplace modules.
- Admin CSS loads only on marketplace admin screens.
- Settings registration accepts only valid `access_mode` values.
- Optional integration notice lists inactive optional suite plugins.

## Buyer workflow checks

- Approved buyer can access `/deal-marketplace/`.
- Buyer can view active listing cards or setup modules.
- Buyer can submit interest when the form/integration is present and the buyer has submit capability.
- Interest row is written with listing ID, buyer identity, offer amount when present, message, status `new`, and timestamp.
- Audit log records `interest_submitted`.
- Buyer is redirected back to the referring page after submission.
- NDA acceptance records `(listing_id, user_id)`, timestamp, and hashed IP.
- Audit log records `nda_accepted`.
