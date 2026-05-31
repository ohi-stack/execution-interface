# Algonquian PDF & Signature Engine

WordPress module for real-estate document execution workflows.

## Capabilities

- PDF rendering from structured deal payloads and archived document records.
- Signature requests with public shortcodes and REST signing endpoints.
- Document archive tables for source payloads, rendered HTML, PDF checksums, signature hashes, and timestamps.
- Execution status tracking across draft, sent, signed, archived, voided, and expired states.
- Audit-event logging for create, send, signature completion, archive, and void actions.

## REST API

- `GET /wp-json/algq/v1/documents` — list document archive records.
- `POST /wp-json/algq/v1/documents` — render and create a document.
- `GET /wp-json/algq/v1/documents/{id}` — retrieve one document and audit events.
- `GET /wp-json/algq/v1/documents/{id}/pdf` — retrieve a base64 PDF payload with checksum headers.
- `POST /wp-json/algq/v1/documents/{id}/send` — mark a signature request as sent.
- `POST /wp-json/algq/v1/documents/{id}/archive` — archive a document.
- `POST /wp-json/algq/v1/documents/{id}/void` — void a document.
- `POST /wp-json/algq/v1/documents/{uid}/sign` — public signature completion endpoint.

## Shortcode

Use `[algq_signature document_uid="DOC-YYYYMMDD-ABC12345"]` on a protected page to show the rendered document preview and signature form.
