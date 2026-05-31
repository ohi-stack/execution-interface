# Algonquian Deal Intake

Production intake module for seller leads and property opportunities.

## Features

- Standalone WordPress plugin module with the `[algq_deal_intake]` shortcode for seller, property, lead source, motivation, and tag fields.
- Central validation engine shared by shortcode submissions, REST requests, admin CSV imports, and REST CSV imports.
- Lead source tracking for shortcode source, UTM campaign, UTM medium, referrer, and landing page attribution.
- Seller motivation scoring based on selling timeline, repairs, occupancy, price-to-ARV, and motivation keywords.
- Property tagging stored as structured JSON for downstream CRM and underwriting modules, including auto-tags such as `urgent-timeline`, `heavy-rehab`, and `deep-discount`.
- REST API endpoints under `/wp-json/algq/v1/deals` for create, list, detail, update, import, and export workflows.
- Admin CSV import/export workflows for operations teams.

## REST API

- `POST /wp-json/algq/v1/deals` — public lead creation endpoint.
- `GET /wp-json/algq/v1/deals` — admin-only list endpoint with optional `status`, `lead_source`, `min_score`, and `limit` query parameters.
- `GET /wp-json/algq/v1/deals/{id}` — admin-only deal detail endpoint.
- `PATCH /wp-json/algq/v1/deals/{id}` — admin-only deal update endpoint that revalidates and rescores the lead.
- `GET /wp-json/algq/v1/deals/export` — admin-only CSV export response for integrations.
- `POST /wp-json/algq/v1/deals/import` — admin-only multipart CSV import endpoint using a `file` or `algq_deal_csv` upload field.

## CSV columns

`deal_id`, `seller_name`, `seller_phone`, `seller_email`, `address`, `asking_price`, `estimated_arv`, `lead_source`, `source_campaign`, `source_medium`, `source_referrer`, `source_landing_page`, `motivation_score`, `property_tags`, `status`, `created_at`.
