# Algonquian Pipeline CRM

Algonquian Pipeline CRM (`algq-pipeline-crm`) is the acquisition lifecycle CRM for the Algonquian Real Estate platform. It manages deals from lead capture through underwriting, offers, contract, buyer assignment, and close.

## Installation

1. Copy `algq-pipeline-crm` into `wp-content/plugins/`.
2. Activate **Algonquian Pipeline CRM** from **Plugins** in WordPress Admin.
3. On activation the plugin creates/updates its database tables, seeds default stages, and grants pipeline capabilities to administrators.
4. Visit **Algonquian Pipeline CRM → Board** to view the Kanban pipeline.

## Shortcodes

- `[algq_pipeline_board]` — renders the Kanban board for users with `algq_view_pipeline`.
- `[algq_pipeline_crm]` — backward-compatible alias for the same board.

Shortcode output is buffered and never echoed directly from the shortcode callback.

## REST Routes

All routes are registered under `/wp-json/algq/v1/pipeline` and require the WordPress REST nonce (`X-WP-Nonce`) plus the relevant pipeline capability.

| Route | Methods | Capability | Purpose |
| --- | --- | --- | --- |
| `/deals` | `GET` | `algq_view_pipeline` | List pipeline deals. |
| `/deals` | `POST` | `algq_edit_deals` or `algq_manage_pipeline` | Create a deal and log `deal_created`. |
| `/deals/(?P<id>\d+)` | `GET` | `algq_view_pipeline` | Retrieve a single deal. |
| `/deals/(?P<id>\d+)` | `PUT/PATCH/POST` | `algq_edit_deals` or `algq_manage_pipeline` | Update editable deal fields. |
| `/deals/(?P<id>\d+)/stage` | `POST` | `algq_edit_deals` or `algq_manage_pipeline` | Move a deal to a new stage and log `stage_changed`. |
| `/activity` | `GET` | `algq_view_pipeline` | List recent activity. |
| `/metrics` | `GET` | `algq_view_pipeline` | Return total, open, closed, and per-stage counts. |

## Database Tables

The plugin creates the following tables with `dbDelta` on activation:

- `{$wpdb->prefix}algq_pipeline_deals`
- `{$wpdb->prefix}algq_pipeline_stages`
- `{$wpdb->prefix}algq_pipeline_activity`
- `{$wpdb->prefix}algq_pipeline_notes`
- `{$wpdb->prefix}algq_pipeline_assignments`

## Default Stages

| Key | Label |
| --- | --- |
| `lead_captured` | Lead Captured |
| `underwriting` | Underwriting |
| `offer_sent` | Offer Sent |
| `under_contract` | Under Contract |
| `buyer_assigned` | Buyer Assigned |
| `closed` | Closed |

## Capabilities

The following custom capabilities are created for administrators on activation:

- `algq_view_pipeline`
- `algq_manage_pipeline`
- `algq_edit_deals`
- `algq_assign_deals`
- `algq_close_deals`

## Activity Logging

The activity table records important lifecycle events, including:

- Deal created
- Stage changed
- Assigned user changed
- Note added
- Offer generated
- Underwriting updated
- Buyer assigned
- Deal closed

## Integration Hooks

### Actions Fired

- `do_action('algq_pipeline_deal_created', $deal_id, $deal)`
- `do_action('algq_pipeline_stage_changed', $deal_id, $old_stage, $new_stage)`
- `do_action('algq_pipeline_deal_closed', $deal_id)`

### Actions Listened For

- `algq_deal_intake_created`
- `algq_mao_underwriting_saved`
- `algq_offer_generated`
- `algq_buyer_assigned`
- `algq_funding_status_updated`

## Testing Instructions

From the repository root run:

```bash
find algonquian-real-estate/plugins/algq-pipeline-crm -name '*.php' -print0 | xargs -0 -n1 php -l
npm run check
bash algonquian-real-estate/scripts/build-plugin-zips.sh
```

`npm run check` depends on the JavaScript application dependencies at the repository root. The plugin zip build writes packages to `algonquian-real-estate/deployment/plugin-zips/`.
