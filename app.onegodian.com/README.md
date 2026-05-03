# app.onegodian.com

Next.js + TypeScript + Tailwind + Prisma + PostgreSQL foundation for the OneGodian Ecosystem App.

## Modules
- Authenticated dashboard
- Profile & membership
- ODIN registry browser
- Planetary registry (25 seeded planets)
- Certificate viewer/verifier
- Digital products/downloads
- Media/canon library
- Tools directory
- Admin record manager
- Audit log foundation

## Setup
1. `cp .env.example .env` and set `DATABASE_URL`.
2. `npm install`
3. `npx prisma generate`
4. `npx prisma migrate dev --name init`
5. `npm run prisma:seed`
6. `npm run dev`

## Deployment (Hostinger/VPS)
1. Provision Node 20+, PostgreSQL, and reverse proxy (Nginx).
2. Build: `npm ci && npm run build`.
3. Run migrations: `npx prisma migrate deploy && npm run prisma:seed`.
4. Start with process manager: `pm2 start npm --name app-onegodian -- start`.
5. Nginx proxy to app port and enable TLS.

## Architecture notes
- Public routes are under `app/(public)`.
- Authenticated modules are under `app/(auth)`.
- Reusable interfaces and auth role utility live in `lib/`.
