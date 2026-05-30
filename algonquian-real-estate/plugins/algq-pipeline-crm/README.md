# Algonquian Pipeline CRM

Production CRM module for managing seller deals after intake.

## Features

- `[algq_pipeline_crm]` shortcode and admin page for a Kanban pipeline board.
- Drag-and-drop movement through controlled stages from lead capture to closeout.
- Activity logging for stage changes, notes, and assignment changes.
- Internal deal notes displayed on each deal card.
- Assignment tracking with WordPress users as deal owners.
- Audit history persisted in UTC-first timestamped tables.
- Admin REST endpoints under `/wp-json/algq/v1/pipeline` for pipeline reads and stage movement.

## Data model

The module reads intake deals from the shared `algq_deals` table created by the Deal Intake plugin and stores CRM-specific state in:

- `algq_pipeline_deals` — stage, assigned owner, priority, and activity timestamps.
- `algq_pipeline_activity` — immutable audit log for stage, note, and assignment changes.
- `algq_pipeline_notes` — internal deal notes.

## Shortcode

Place `[algq_pipeline_crm]` on an internal WordPress page. Users must have `edit_posts` capability to view or update the board.
