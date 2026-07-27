# OneGodian App

Domain: https://app.onegodian.com

## Purpose

The OneGodian App is the public and member-facing application layer of the OneGodian ecosystem.

It provides user dashboards, ecosystem navigation, registry viewing, tools, certificates, member features, products, media access, settings, and public-safe documentation.

## Allowed Areas

- /dashboard
- /ecosystem
- /registry
- /tools
- /members
- /certificates
- /products
- /media
- /settings
- /docs
- /api/health
- /api/manifest
- /api/tools
- /api/stats

## Restricted Areas

The App must not contain internal control-plane functions, including:

- ACC
- OCP
- OEG
- privileged agent controls
- workflow administration
- policy editing
- approvals
- audit mutation
- internal logs
- adapters
- deployment controls
- kill-switch controls

## Rule

App = user experience, member access, tools, registry viewing, and ecosystem interaction.
