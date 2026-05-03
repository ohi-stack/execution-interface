# Deployment Guide

## Deploy Root Normalization

- Repository root is a passthrough wrapper for Hostinger.
- The **only deployable Next.js app root** is `apps/web`.

## Root-level commands (Hostinger)
Run from repository root:

```bash
npm run build
npm run start
npm run lint
```

These commands proxy into `apps/web`.

## Direct app commands
Run from `apps/web` when operating the app directly:

```bash
npm ci
npm run lint
npm run build
npm run start
```

## Required environment variables

- `NEXT_PUBLIC_APP_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `AUTH_TRUST_HOST`
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Notes

- Do not commit secrets.
- Keep environment placeholders only in example files.
