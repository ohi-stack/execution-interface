# Data model

The installer creates the 15 `wp_algq_*` tables requested for clients, properties, authorizations, visits, checklist items, photos, service requests, vendors, estimates, expenses, incidents, emergency contacts, messages, documents, and activity. The actual prefix is the site's `$wpdb->prefix`.

Every table has an internal ID, UUID, status, creator, assignee, timestamps, access level, and audit version. Sensitive instructions are AES-256-GCM encrypted using a key derived from the WordPress secure-auth salt. Records reference WordPress users and attachments by ID; protected content is not stored in post metadata.

Deletion should be a status transition to `deleted` until the configured retention date. A later retention job may permanently erase content while preserving a minimal, non-sensitive audit tombstone.
