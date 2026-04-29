# ONEGODIAN Capital Web

Next.js App Router frontend for capital.onegodian.com.

## Hostinger Deployment Settings

- Framework preset: Next.js
- Branch: main
- Node version: 20.x
- Root directory: `./`
- Install command: `npm ci`
- Build command: `npm run build`
- Start command: `npm run start`
- Output directory: `.next`

## Environment

Required:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.onegodian.org
```

## App Router Requirement

This repository must include `src/app` (with at minimum `src/app/layout.tsx` and `src/app/page.tsx`) for Next.js App Router detection during build.
