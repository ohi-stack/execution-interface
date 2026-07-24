# OMOS Security

Authentication uses HTTP-only same-site sessions, CSRF tokens on login, scrypt password hashes, session expiration, login rate limiting, and failed-login audit logging. RBAC roles are visitor, member, developer, editor, operator, and administrator. Dashboard routes require member or higher. Admin and privileged runtime controls require operator or administrator, never a generic read capability.

Secrets must be injected through production environment variables. Do not hard-code credentials, passwords, or API keys.
