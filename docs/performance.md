# Algonquian Deal Marketplace Performance Guide

## Query strategy

- Keep public marketplace reads focused on active listings.
- The current active-listing query filters by `status = active`, orders by `updated_at DESC`, and limits results to 50 rows.
- Use `$wpdb->prepare()` for dynamic SQL conditions.
- Avoid loading full diligence documents, NDA files, CRM notes, or large metadata blobs in the initial card list.
- Add pagination or cursor-based loading before increasing the public listing limit.
- Prefer summary columns for public card rendering and lazy-load detail payloads behind buyer/NDA checks.

## Cache strategy

- Use `ALGQ_Deal_Marketplace_Cache` for marketplace-level cached data.
- Store data in WordPress object cache first and transients as a persistent fallback.
- Cache optional integration status because plugin availability checks can involve file loading and active-plugin lookups.
- Cache active listings when listing volume or traffic justifies it, using invalidation on listing, NDA, interest, and settings changes.
- Keep buyer-specific, NDA-specific, and capability-specific data out of shared public caches unless the key includes the relevant user/listing context.

## Asset loading

- Public CSS and JavaScript are registered on `wp_enqueue_scripts`.
- Public assets are enqueued only when `[algq_marketplace]` or `[algq_deal_marketplace]` renders.
- Admin CSS is enqueued only when the admin hook suffix contains `algq-deal-marketplace`.
- Version asset URLs with `ALGQ_DEAL_MARKETPLACE_VERSION` to support browser-cache busting on releases.
- Keep public JavaScript progressive and non-blocking; the marketplace page should remain readable if JavaScript fails.

## Admin table pagination

The current admin screen renders the active listing/module table directly. Before production listing volume grows, add:

- `WP_List_Table` or equivalent pagination for listings, interests, NDA records, and audit logs.
- Server-side filtering by status, visibility, buyer email, listing ID, and date range.
- Bounded page sizes such as 20, 50, or 100 rows.
- Indexed sort columns only.
- Bulk actions protected by nonces and capabilities.

## Shortcode rendering performance

- Shortcode rendering should perform one bounded listing query for the marketplace card list.
- Avoid per-card queries in loops; prefetch required data in repository methods.
- Escape during output but sanitize during input/write to avoid repeated sanitization work on trusted stored fields.
- Do not call optional integration checks from inside each listing card.
- If rendering buyer-specific buttons, prefetch buyer capability/NDA state once per request and pass it to the renderer.

## Database indexing expectations

Expected indexes from activation:

- Listings: `status`, `visibility`.
- Interests: `listing_id`, `buyer_email`.
- NDAs: unique `(listing_id, user_id)`.
- Audit log: `action`, `(object_type, object_id)`.

Recommended future indexes as data volume grows:

- Listings: composite `(status, updated_at)` for the active listing query.
- Listings: composite `(visibility, status)` for gated browsing.
- Interests: composite `(listing_id, status)` for listing-level review queues.
- Interests: composite `(buyer_email, created_at)` for buyer activity history.
- Audit log: composite `(action, created_at)` for operational reporting.
