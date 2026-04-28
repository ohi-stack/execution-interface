# Security Notes

These notes define minimum security expectations for staging and production-like deployments.

## 1) Secrets handling

- Store `DATABASE_URL`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET` in a secret manager or deployment environment variables.
- Never commit real secret values to Git, CI logs, or screenshots.
- Never log `DATABASE_URL` (full or partial) in application logs, debug output, or CI job traces.
- Rotate secrets immediately if accidental exposure is suspected.
- Use separate credentials for staging and production.

## 2) Stripe webhook verification

- Verify incoming Stripe webhook signatures with `STRIPE_WEBHOOK_SECRET` before processing events.
- Reject unsigned/invalid signatures with non-2xx response.
- Record webhook processing outcomes for audit/debugging.
- Use idempotent event handling to prevent duplicate subscription updates.

## 3) Admin endpoint protection

- Restrict `/admin/*` endpoints to authenticated users with admin role claims.
- Require JWT verification and role guard checks server-side for every admin route.
- Ensure admin tokens are short-lived and issued only from trusted auth flows.
- Log admin access attempts and failures.

## 4) Download token expiration

- Download tokens must be cryptographically random and time-limited.
- Validate token signature/identifier and expiration on every download request.
- Return authorization errors for expired, revoked, or malformed tokens.
- Avoid embedding sensitive user data directly in download tokens.

## 5) Database access rules

- Application should use least-privilege DB credentials required for runtime operations.
- Restrict database network access to trusted app/runtime hosts.
- Run schema migrations from controlled CI/CD or approved deployment sessions only.
- Enable backups and test restore procedures regularly.
