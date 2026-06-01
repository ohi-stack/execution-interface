# Algonquian Deal Marketplace Architecture

## Plugin purpose

The Algonquian Deal Marketplace plugin provides the buyer-facing marketplace layer for the Algonquian Real Estate (ARE) suite. It packages private wholesale deal distribution, investor access, buyer subscriptions, premium listing visibility, NDA acceptance records, buyer interest capture, audit logging, generated WordPress pages, shortcodes, admin screens, and optional suite-integration awareness into a single WordPress plugin.

The plugin is intentionally modular: the marketplace can render a useful readiness view by itself, while optional ARE plugins can deepen deal intake, CRM routing, buyer-portal access, document management, commerce, and operations workflows.

## WordPress architecture

The main plugin file is `algonquian-real-estate/plugins/algq-marketplace/algq-marketplace.php`. It defines plugin constants, loads include files, registers activation and deactivation hooks, and boots the runtime coordinator on `plugins_loaded`.

High-level WordPress hooks:

1. **Activation** provisions capabilities, database tables, the default marketplace page, default options, and permalink rules.
2. **Deactivation** refreshes rewrite rules without deleting marketplace data.
3. **Runtime boot** creates the singleton coordinator and registers public, admin, form, asset, integration, and REST hooks.
4. **`init`** registers public shortcodes.
5. **`rest_api_init`** registers the public marketplace status endpoint.
6. **`admin_menu` / `admin_init`** expose the admin screen and settings registration for authorized users.
7. **`admin_post_*`** handles buyer interest submission for authenticated and unauthenticated requests, with nonce and capability gates.

## Class map

| Class / file | Responsibility |
| --- | --- |
| `ALGQ_Deal_Marketplace` / `includes/class-algq-deal-marketplace.php` | Main coordinator. Instantiates services, registers runtime hooks, registers REST route, exposes NDA and audit services. |
| `ALGQ_Deal_Marketplace_Activator` | Activation workflow: capabilities, tables, generated page, default options, rewrite flush. |
| `ALGQ_Deal_Marketplace_Deactivator` | Deactivation rewrite refresh. |
| `ALGQ_Deal_Marketplace_Capabilities` | Capability declarations, install, and removal helpers. |
| `ALGQ_Deal_Marketplace_Security` | Nonce verification, sanitization helpers, and capability gate helpers. |
| `ALGQ_Deal_Marketplace_Cache` | Object-cache/transient wrapper for marketplace cache keys. |
| `ALGQ_Deal_Marketplace_Repository` | Database table names, schema creation, active listing reads, buyer interest writes, NDA acceptance writes, audit log writes, and fallback marketplace modules. |
| `ALGQ_Deal_Marketplace_Renderer` | Public shortcode markup and admin screen markup. |
| `ALGQ_Deal_Marketplace_Shortcodes` | Registers `[algq_marketplace]` and `[algq_deal_marketplace]`. |
| `ALGQ_Deal_Marketplace_Assets` | Registers/enqueues public CSS/JS and admin CSS on plugin screens. |
| `ALGQ_Deal_Marketplace_Admin` | Registers the Deal Marketplace admin menu, settings, settings sanitization, and admin-page permission gate. |
| `ALGQ_Deal_Marketplace_Audit_Log` | Writes auditable workflow events through the repository. |
| `ALGQ_Deal_Marketplace_NDA` | Records NDA acceptance and audit events. |
| `ALGQ_Deal_Marketplace_Interest` | Processes buyer interest submissions from `admin-post.php`. |
| `ALGQ_Deal_Marketplace_Integrations` | Detects optional ARE suite plugins, caches integration status, and renders missing-plugin admin notices. |
| `Algq_Marketplace_Plugin`, `Algq_Marketplace_Activator`, `Algq_Marketplace_Sanitizer` | Legacy compatibility layer for older `algq_marketplace` module consumers. |

## Data flow

### Public marketplace render

1. WordPress renders a page containing `[algq_marketplace]` or `[algq_deal_marketplace]`.
2. `ALGQ_Deal_Marketplace_Shortcodes` enqueues public assets only when the shortcode is rendered.
3. `ALGQ_Deal_Marketplace_Renderer::render_marketplace()` checks whether the current user can view the marketplace.
4. Authorized users receive active listings from `ALGQ_Deal_Marketplace_Repository::get_active_listings()`.
5. If no active database rows exist, the repository returns default marketplace modules so the screen remains useful during setup.
6. The renderer escapes all listing output before returning HTML.

### Admin render

1. An authorized user opens **Deal Marketplace** in the WordPress admin.
2. `ALGQ_Deal_Marketplace_Admin` verifies `algq_manage_deal_marketplace` or `manage_options`.
3. The renderer loads active listings or fallback modules.
4. Admin CSS is enqueued only on marketplace admin screens.

### REST status render

1. `GET /wp-json/algq/v1/marketplace` returns plugin name, version, supported shortcodes, default module metadata, and optional integration status.
2. Integration status is cached to reduce repeated plugin-availability checks.

## Buyer marketplace workflow

1. Administrator activates the plugin and verifies capabilities, generated page, settings, and optional integration notices.
2. Buyer or investor account receives `algq_view_deal_marketplace`; if interest submission is allowed, it also receives `algq_submit_deal_interest`.
3. Buyer visits the generated **Deal Marketplace** page at `/deal-marketplace/`.
4. The shortcode checks marketplace access and renders active listings or readiness modules.
5. Buyer reviews wholesale deals, investor-access modules, syndication status, subscription options, or premium listing cards.
6. Buyer submits interest where enabled; submissions are routed through `admin-post.php`, saved to the interests table, audited, and redirected back to the referring page.
7. Downstream ARE plugins can consume the captured interest for CRM, portal, commerce, document, or command-center workflows.

## NDA workflow

1. A listing or deal room that requires confidentiality should call `ALGQ_Deal_Marketplace_NDA::accept($listing_id, $user_id)` after the buyer explicitly accepts the NDA terms.
2. The NDA service hashes the request IP using WordPress hashing helpers before persistence.
3. The repository writes or replaces a unique `(listing_id, user_id)` acceptance record in the NDA table.
4. The audit log records `nda_accepted` with listing context.
5. Protected deal details should check for the appropriate acceptance record before rendering sensitive material.

The current NDA service records acceptance. Any template or integration that exposes confidential deal detail must enforce the NDA gate before output and before download generation.

## Buyer interest workflow

1. A buyer submits an interest form to `admin-post.php` with action `algq_deal_marketplace_interest`.
2. `ALGQ_Deal_Marketplace_Interest` verifies the marketplace nonce using `ALGQ_Deal_Marketplace_Security::NONCE_ACTION` and `NONCE_NAME`.
3. The same handler verifies `algq_submit_deal_interest`, `algq_manage_deal_marketplace`, or `manage_options`.
4. Input fields are normalized: listing ID with `absint`, buyer name and message with text sanitization, buyer email with email sanitization, and offer amount as a float when present.
5. The repository inserts the interest row with status `new` and the current user ID when available.
6. The audit log records `interest_submitted` against the interest object.
7. WordPress redirects back to the referrer or home page.

## Generated pages

Activation creates or links the default public page:

| Slug | Title | Content | Option |
| --- | --- | --- | --- |
| `deal-marketplace` | Deal Marketplace | `[algq_marketplace]` | `algq_deal_marketplace_page_id` |

Legacy compatibility code also exposes generated page definitions for `are-marketplace` containing `[algq_marketplace]` where older consumers call `algq_marketplace_generated_pages()`.

## Shortcodes

| Shortcode | Purpose |
| --- | --- |
| `[algq_marketplace]` | Primary public marketplace shortcode. |
| `[algq_deal_marketplace]` | Alias for the same renderer. |

Shortcodes should be placed on protected pages when marketplace access is private or member-only.

## Admin screens

| Screen | Slug | Capability | Purpose |
| --- | --- | --- | --- |
| Deal Marketplace | `algq-deal-marketplace` | `algq_manage_deal_marketplace` | Shows marketplace modules/listing readiness and operational messaging. |

The plugin also registers the `algq_deal_marketplace_options` setting with a sanitized `access_mode` value of `private`, `members`, or `public`.

## Database tables

All table names use the site `$wpdb->prefix`.

| Table | Purpose | Key columns / indexes |
| --- | --- | --- |
| `algq_deal_marketplace_listings` | Marketplace listing inventory. | `id`, `deal_id`, `title`, `status`, `visibility`, `price`, `meta`, `created_at`, `updated_at`; indexes on `status` and `visibility`. |
| `algq_deal_marketplace_interests` | Buyer interest and offer signals. | `id`, `listing_id`, `user_id`, `buyer_name`, `buyer_email`, `offer_amount`, `message`, `status`, `created_at`; indexes on `listing_id` and `buyer_email`. |
| `algq_deal_marketplace_ndas` | Per-listing NDA acceptance records. | `id`, `listing_id`, `user_id`, `accepted_at`, `ip_hash`; unique index on `(listing_id, user_id)`. |
| `algq_deal_marketplace_audit_log` | Workflow audit trail. | `id`, `user_id`, `action`, `object_type`, `object_id`, `context`, `created_at`; indexes on `action` and `(object_type, object_id)`. |

## Capability model

| Capability | Intended holders | Allows |
| --- | --- | --- |
| `algq_manage_deal_marketplace` | Administrators and trusted marketplace operators. | Admin screen access, management views, and elevated marketplace operations. |
| `algq_view_deal_marketplace` | Approved buyers, investors, subscribers, administrators. | Public shortcode marketplace visibility. |
| `algq_submit_deal_interest` | Approved buyers/investors and administrators. | Buyer interest form submission. |
| `algq_manage_deal_ndas` | Administrators and compliance/operations users. | NDA management workflows and future NDA administration screens. |

Activation grants all marketplace capabilities to `administrator` and grants view/interest capabilities to `subscriber`. Sites with stricter buyer vetting should remove default subscriber access and assign capabilities through a buyer/investor role, membership plugin, or buyer-portal integration.

## Integration points with the ARE suite

`ALGQ_Deal_Marketplace_Integrations` detects optional ARE plugins by function, class, or active plugin file and caches their status under the marketplace cache group. The marketplace remains operational when these plugins are inactive, but an admin notice lists missing optional integrations.

| Integration | Expected role in the marketplace workflow |
| --- | --- |
| `algq-deal-intake` | Supplies inbound deal records that can become marketplace listings. |
| `algq-pipeline-crm` | Routes buyer interest to acquisition, sales, investor-relations, or follow-up pipelines. |
| `algq-buyer-portal` | Provides buyer onboarding, saved buy boxes, account-level permissions, and private deal-room access. |
| `algq-document-library` | Stores NDA templates, diligence files, underwriting summaries, and downloadable documents. |
| `algq-digital-store` | Supports paid digital access products, document packs, or subscription-like marketplace assets. |
| `algq-woocommerce-bridge` | Connects buyer subscriptions, paid access, and checkout workflows to WooCommerce. |
| `algq-command-center` | Centralizes operator dashboards, status monitoring, and executive workflow visibility. |
