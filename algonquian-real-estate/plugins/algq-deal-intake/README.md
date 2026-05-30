# Algonquian Deal Intake

Production intake module for seller leads and property opportunities.

## Features

- `[algq_deal_intake]` shortcode with seller, property, lead source, motivation, and tag fields.
- Central validation engine for shortcode submissions, REST requests, and CSV imports.
- Seller motivation scoring based on selling timeline, repairs, occupancy, and motivation keywords.
- Property tagging stored as structured JSON for downstream CRM and underwriting modules.
- REST API endpoints under `/wp-json/algq/v1/deals`.
- Admin CSV import/export workflows for operations teams.

## REST API

- `POST /wp-json/algq/v1/deals` — public lead creation endpoint.
- `GET /wp-json/algq/v1/deals` — admin-only list endpoint with optional `status`, `lead_source`, and `limit` query parameters.
- `GET /wp-json/algq/v1/deals/{id}` — admin-only deal detail endpoint.

## CSV columns

`deal_id`, `seller_name`, `seller_phone`, `seller_email`, `address`, `asking_price`, `lead_source`, `motivation_score`, `property_tags`, `status`, `created_at`.
