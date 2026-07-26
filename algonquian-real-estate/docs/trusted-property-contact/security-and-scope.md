# Security and scope

REST operations require an authenticated WordPress REST nonce and enforce property ownership inside the service layer. Administrative functions check capabilities. Views, downloads, edits, approvals, and lifecycle actions must use the central activity logger, which records actor, timestamp, object, property/client context, and an HMAC of the request IP.

Uploads must use WordPress attachment APIs with an explicit allowlist (PDF, JPEG, PNG, or WebP), verified MIME type, randomized filename, size limit, and malware scanning where the host supports it. Sensitive files must live outside the public web root or be denied by server configuration and delivered only by a protected endpoint after a fresh authorization check. Never expose attachment URLs to clients.

Access and emergency instructions are encrypted at rest and returned only to users with the sensitive-data capability. Lockbox codes and alarm credentials must never be placed in posts, post metadata, logs, notifications, URLs, or unencrypted document fields. Secrets should be rotated when staff access changes.

Consent snapshots and signed authorization documents are versioned. Service coordination must stop when authorization expires or is revoked. Data retention and deletion must follow the service agreement and applicable law, with audit tombstones retained only where required.
