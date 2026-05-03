# WooCommerce Product Standard (Capital-Linked Products)

## Standard
- WooCommerce product records are used for checkout execution only.
- Capital offering presentation belongs in Capital Portal pages (offering pages and disclosure-backed views).
- Capital-linked products should be hidden from normal storefront browsing.
- Disclosure acceptance must occur before instrument issuance.

## Product Setup Guidance
For WooCommerce products linked to `_onegodian_capital_offering_id`, use the following baseline:

1. **Catalog visibility:** `hidden`
2. **Reviews:** disabled
3. **Category:** `Capital Test Products` (or equivalent restricted internal category)
4. **Copy constraints:** do not use investment, yield, or guarantee language in product descriptions

## Implementation Notes
- Use `Onegodian_Capital_WooCommerce::is_capital_product($product_id)` to detect product linkage.
- Use `Onegodian_Capital_WooCommerce::get_recommended_product_settings()` and the `onegodian_capital_product_recommended_settings` filter to customize operational standards in local deployments.
