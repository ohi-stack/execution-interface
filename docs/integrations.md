# Algonquian Deal Marketplace Integrations

The Deal Marketplace is designed to run independently while detecting optional Algonquian Real Estate suite plugins. Missing optional plugins generate an informational admin notice for marketplace managers but should not block activation, shortcode rendering, or basic admin visibility.

Integration status is exposed through the marketplace REST status payload and cached briefly under the marketplace cache group.

## Integration principles

- Treat all integrations as optional unless a deployment explicitly requires them.
- Detect integrations by known class, function, or active plugin file.
- Never assume an optional plugin is active when rendering public deal information.
- Keep marketplace access and NDA gates in the marketplace layer even when another plugin owns documents, CRM records, or products.
- Use audit logs when data crosses workflow boundaries.

## `algq-deal-intake`

Expected role:

- Originates seller/deal intake records.
- Supplies deal candidates that can become marketplace listings.
- Provides upstream intake metadata such as property summary, seller context, acquisition strategy, and diligence status.

Recommended integration flow:

1. Intake creates or updates a qualified deal.
2. Operator approves the deal for marketplace distribution.
3. Marketplace creates/updates a listing record with a reference to the intake/deal ID.
4. Marketplace invalidates active listing caches.
5. Audit log records the publication or update event.

## `algq-pipeline-crm`

Expected role:

- Routes buyer interest to sales, acquisitions, investor-relations, or dispositions pipelines.
- Tracks follow-up tasks, stages, and owner assignment.
- Maintains relationship history for buyers and capital partners.

Recommended integration flow:

1. Buyer submits marketplace interest.
2. Marketplace stores the interest and records `interest_submitted`.
3. CRM receives the interest payload or polls the interests table.
4. CRM creates/updates a contact, opportunity, task, or pipeline stage.
5. Marketplace audit context stores the CRM handoff identifier when available.

## `algq-buyer-portal`

Expected role:

- Manages buyer onboarding, approval state, buy boxes, saved markets, and private account pages.
- Provides a better role/capability assignment workflow than default subscriber grants.
- Can surface marketplace listings inside a buyer dashboard.

Recommended integration flow:

1. Buyer completes onboarding in Buyer Portal.
2. Buyer Portal grants marketplace view/submit capabilities when approved.
3. Buyer Portal links to `/deal-marketplace/` or embeds the shortcode in a protected dashboard.
4. Buyer preferences can filter marketplace listing visibility in future repository methods.

## `algq-document-library`

Expected role:

- Stores NDA templates, executed NDA references, diligence documents, underwriting summaries, photos, and downloadable artifacts.
- Enforces document permissions in coordination with marketplace listing/NDA state.

Recommended integration flow:

1. Marketplace listing references a document collection or folder.
2. Buyer accepts NDA for the listing.
3. Document Library checks marketplace NDA state before serving confidential documents.
4. Document downloads are logged in the document system and/or marketplace audit log.

## `algq-digital-store`

Expected role:

- Provides digital products related to marketplace access, document packs, education products, or paid research assets.
- Supports monetization that is adjacent to the marketplace but not necessarily WooCommerce-specific.

Recommended integration flow:

1. Operator maps digital products to marketplace access tiers or listing add-ons.
2. Buyer purchases or receives access.
3. Digital Store grants entitlement.
4. Marketplace checks entitlement before rendering premium content if configured.

## `algq-woocommerce-bridge`

Expected role:

- Connects marketplace subscriptions, buyer memberships, paid deal access, and checkout workflows to WooCommerce.
- Maps WooCommerce order/subscription state to marketplace capabilities or entitlements.

Recommended integration flow:

1. Buyer purchases a subscription or access product through WooCommerce.
2. WooCommerce Bridge validates payment/subscription state.
3. Bridge grants marketplace capabilities or buyer-portal entitlement.
4. Marketplace renders gated content based on capability and NDA state.
5. Failed/cancelled subscriptions revoke or suspend marketplace access.

## `algq-command-center`

Expected role:

- Centralizes operator dashboards, health checks, deployment status, and cross-plugin workflow visibility.
- Consumes marketplace REST status and audit signals.
- Provides executive-level visibility into buyer interest, NDA acceptance, listing status, and optional integration health.

Recommended integration flow:

1. Command Center reads `GET /wp-json/algq/v1/marketplace`.
2. It displays version, shortcodes, default modules, and integration activity.
3. It links operators to the marketplace admin screen.
4. It flags missing optional integrations or stale workflow state.

## Integration status keys

The marketplace status service uses these logical keys:

| Key | Label | Detection hints |
| --- | --- | --- |
| `deal_intake` | Deal Intake | Function `algq_deal_intake_core_available` or plugin file. |
| `pipeline_crm` | Pipeline CRM | Class `ALGQ_Pipeline_CRM` or plugin file. |
| `buyer_portal` | Buyer Portal | Class `ALGQ_Buyer_Portal` or plugin file. |
| `document_library` | Document Library | Active plugin file. |
| `digital_store` | Digital Store | Active plugin file. |
| `woocommerce_bridge` | WooCommerce Bridge | Class `ALGQ_WooCommerce_Bridge` or plugin file. |
| `command_center` | Command Center | Active plugin file. |
