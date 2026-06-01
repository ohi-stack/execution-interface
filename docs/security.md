# Algonquian Deal Marketplace Security Guide

## Nonce strategy

- Use `ALGQ_Deal_Marketplace_Security::NONCE_ACTION` for marketplace actions.
- Use `ALGQ_Deal_Marketplace_Security::NONCE_NAME` as the submitted nonce field name.
- Verify nonces before processing buyer interest, NDA acceptance, cache clearing, settings changes, or bulk admin actions.
- Use separate action names for future destructive operations when practical, such as cache clearing, listing deletion, or NDA administration.
- Nonce failure should return a 403-style response and should not reveal private listing details.

## Capability checks

- Admin screen access requires `algq_manage_deal_marketplace` or `manage_options`.
- Public marketplace view requires `algq_view_deal_marketplace`, `algq_manage_deal_marketplace`, or `manage_options`.
- Buyer interest submission requires `algq_submit_deal_interest`, `algq_manage_deal_marketplace`, or `manage_options`.
- NDA administration should require `algq_manage_deal_ndas` or a stricter management capability.
- Do not rely on page visibility alone; shortcodes, form handlers, REST callbacks, downloads, and AJAX endpoints must all enforce capabilities.

## Sanitization rules

- Use `sanitize_text_field()` through the security helper for names, statuses, modes, and short messages.
- Use `sanitize_email()` for buyer email addresses.
- Use `absint()` for listing IDs, user IDs, and object IDs.
- Cast offer amounts to numeric values before storage and validate acceptable business ranges in future pricing workflows.
- Use allowlists for enumerated values such as `access_mode`, `status`, and `visibility`.
- Use `wp_unslash()` before sanitizing request input.

## Escaping rules

- Escape HTML text with `esc_html()`.
- Escape attribute values with `esc_attr()`.
- Escape URLs with `esc_url()`.
- Escape translated strings after translation unless the string is known safe.
- Do not echo listing metadata, buyer messages, integration labels, or admin notice content without escaping.
- Keep rendered marketplace cards free of raw HTML from listing metadata unless sanitized through a strict allowlist.

## Database access rules

- Use `$wpdb->prepare()` for dynamic SELECT queries.
- Use `$wpdb->insert()` and `$wpdb->replace()` with explicit format arrays for writes.
- Keep table names generated internally through repository methods; do not accept table names from request input.
- Store audit context as JSON through `wp_json_encode()`.
- Avoid storing raw IP addresses. The NDA service stores an IP hash.
- Do not query or display confidential listing metadata until buyer and NDA gates have passed.

## Buyer access control

- Approved buyer access should be represented with explicit capabilities or a dedicated buyer/investor role.
- Sites with a public subscriber population should remove default subscriber marketplace access after activation and assign capabilities only to vetted accounts.
- Buyer Portal integration should be the preferred home for onboarding status, buy-box preferences, and account-level gating.
- Marketplace access should be checked at render time and at action-handler time.

## NDA gate enforcement

- NDA acceptance must be recorded per listing and user before confidential deal materials are shown.
- Templates and integrations that render protected details must check the NDA record before output.
- Download endpoints must enforce the same NDA gate as HTML views.
- NDA acceptance events should be audited with `nda_accepted`.
- Changing a listing from non-confidential to confidential should invalidate listing and buyer access caches.

## Upload/download safety if applicable

The current marketplace plugin does not implement direct upload or download endpoints. If document upload/download support is added or delegated to Document Library:

- Require authenticated users and appropriate marketplace/document capabilities.
- Verify nonces for upload and destructive file actions.
- Validate MIME type and extension with WordPress file APIs.
- Store files outside public paths or use signed/permissioned download routes for confidential documents.
- Scan or reject executable files.
- Enforce listing-level NDA acceptance before serving diligence files.
- Log download events for compliance-sensitive materials.
