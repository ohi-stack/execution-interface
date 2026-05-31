# Algonquian Buyer Portal

Production buyer portal for investor onboarding and controlled deal package delivery.

## Features

- `[algq_buyer_portal]` shortcode with login/registration prompt and buyer profile capture.
- NDA gating through user meta before package downloads are exposed.
- Download permissions for deal packages stored in `algq_buyer_deal_packages`.
- Deal package delivery links with premium/role gating fields ready for operations.
- Interest submission workflow stored in `algq_buyer_interest` with stages: Interested, Requested Call, Offer Submitted, Assigned.
- REST endpoints under `/wp-json/algq/v1/buyer/packages` and `/wp-json/algq/v1/buyer/interest`.
