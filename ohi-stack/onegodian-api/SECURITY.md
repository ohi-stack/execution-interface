# Security Policy

## Secrets policy
- Never commit secrets to source control.
- Store production credentials in a managed secret store.

## API key / JWT policy
- JWT secrets must be at least 32 characters.
- Rotate API keys and JWT secrets on a defined schedule and after incidents.

## CORS policy
- Restrict `CORS_ORIGIN` to known client domains.
- Do not use wildcard CORS in production.

## Rate limiting policy
- Apply route-level throttling for authentication and high-cost endpoints.
- Monitor blocked request rates for abuse detection.

## Logging policy
- Keep structured request logs for auditability.
- Never log secrets, tokens, or raw credential payloads.
