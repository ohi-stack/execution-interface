# production checklist

This document describes the INO Platform Sync Node production plan for app.indigenousnations.org.

## Scope

The Node.js 22, TypeScript, Next.js App Router application serves authenticated workflows, synchronization, APIs, background jobs, and administration between indigenousnations.org, the INO Platform Plugin, member dashboards, administrative portals, APIs, and future mobile applications.

## Operational requirements

- HTTPS-only production traffic behind a reverse proxy.
- PostgreSQL persistence through Prisma models for synchronized objects and audit logs.
- Redis-backed BullMQ queues for full sync, incremental sync, webhook sync, nightly reconciliation, manual sync, retries, and dead-letter jobs.
- Signed webhooks with timestamp replay windows and idempotency keys.
- Secret values supplied by environment variables only.
- CI/CD must install, lint, typecheck, test, build, docker build, scan, deploy, and verify health endpoints.
