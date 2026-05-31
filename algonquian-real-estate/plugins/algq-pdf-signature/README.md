# Algonquian PDF & Signature Engine

Production document execution module for PDF rendering and signature status tracking.

## Features

- PDF/document rendering archive in `algq_documents`.
- Signature workflow in `algq_signature_requests` with tokenized requests.
- Document archive shortcode `[algq_document_archive]`.
- Execution status tracking: Draft, Rendered, Sent for Signature, Viewed, Signed, Voided, Archived.
- Audit log storage for signature events.
- REST endpoints under `/wp-json/algq/v1/documents`, `/documents/render`, and `/signatures/request`.
