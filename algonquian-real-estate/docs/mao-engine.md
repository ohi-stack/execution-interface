# Algonquian MAO Engine

The Algonquian MAO Engine is the underwriting module for calculating Maximum Allowable Offers for acquisition opportunities. It is implemented as a standalone WordPress plugin at `plugins/algq-mao-engine`.

## Current Scope

- WordPress plugin bootstrap and activation/deactivation hooks.
- Custom database table for storing MAO calculations.
- Calculation service with sanitized numeric inputs and configurable assumptions.
- Admin calculator page and calculation history table.
- Public shortcode calculator: `[algq_mao_calculator]`.
- REST API endpoints under `/wp-json/algq-mao/v1`.

## REST Routes

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/calculations` | List recent calculations for authenticated users with `manage_options`. |
| `POST` | `/calculations` | Validate input, calculate MAO, and persist the result. |
| `POST` | `/calculate` | Validate input and return a non-persisted MAO calculation. |

## Calculation Formula

The baseline formula is:

```text
Maximum Allowable Offer = ARV - Repairs - Closing Costs - Holding Costs - Selling Costs - Financing Costs - Desired Profit - Wholesale Fee - Safety Buffer
```

The service also returns an offer percentage of ARV and a recommended offer range using configurable low/high multipliers.
