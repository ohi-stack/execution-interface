# Algonquian Deal Marketplace Cache Guide

## Cache keys

`ALGQ_Deal_Marketplace_Cache` applies:

- Group: `algq_deal_marketplace`.
- Prefix: `algq_dm_`.

Current logical keys:

| Logical key | Stored key | Purpose |
| --- | --- | --- |
| `integrations` | `algq_dm_integrations` | Optional ARE suite plugin status. |
| `active_listings` | `algq_dm_active_listings` | Reserved by `flush_marketplace()` for active listing cache support. |

Potential future keys should follow the same naming pattern, for example `listing_{id}`, `buyer_access_{user_id}`, or `nda_{listing_id}_{user_id}`. Include user IDs or listing IDs in keys whenever cached data is permission-sensitive.

## TTLs

| Data | Recommended TTL | Rationale |
| --- | --- | --- |
| Integration status | 60 seconds | Admin notices should update quickly after optional plugin activation/deactivation. |
| Active listing cards | 300 seconds | Listing card data changes less frequently than page views. |
| Single listing public summary | 300 seconds | Safe for public summary fields when invalidated on listing updates. |
| Buyer-specific access/NDA state | 60 seconds or request-only | Permission-sensitive and should update quickly. |
| Admin dashboard summaries | 60-300 seconds | Balance operator freshness with query load. |

The cache wrapper defaults `set()` calls to 300 seconds when no TTL is supplied.

## Invalidation triggers

Call `flush_marketplace()` or delete targeted keys when:

- A listing is created, updated, published, unpublished, archived, or deleted.
- Listing status changes to or from `active`.
- Listing visibility changes.
- Marketplace settings change, especially access mode.
- Optional ARE suite plugins are activated or deactivated.
- A buyer role or marketplace capability assignment changes.
- NDA acceptance changes if cached access gates depend on NDA state.
- A clear-cache admin action is executed.

Avoid clearing all WordPress transients when marketplace-only keys are sufficient.

## Clear-cache admin action

A clear-cache action should:

1. Require `algq_manage_deal_marketplace` or `manage_options`.
2. Verify a nonce dedicated to the cache-clear operation.
3. Call `ALGQ_Deal_Marketplace_Cache::flush_marketplace()`.
4. Delete any future targeted listing, buyer, or NDA keys.
5. Record an audit event such as `cache_cleared` with the current user ID.
6. Redirect back to the marketplace admin screen with a success notice.

Do not expose cache clearing to public routes or unauthenticated AJAX endpoints.

## Object cache/transient fallback

The cache wrapper reads from `wp_cache_get()` first. If no object-cache value is found, it falls back to `get_transient()`. Writes call both `wp_cache_set()` and `set_transient()`. Deletes call both `wp_cache_delete()` and `delete_transient()`.

This design works on hosts without a persistent object cache while still benefiting from Redis/Memcached-backed object caches when present. Because transients may persist in the options table, keep cached values compact and avoid storing confidential buyer-only data unless keys are scoped and invalidated correctly.
