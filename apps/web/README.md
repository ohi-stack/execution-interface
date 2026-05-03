# app.onegodian.com

Next.js + TypeScript + Tailwind + Prisma + PostgreSQL app for `app.onegodian.com`.

## Canonical app root
- **Production app root:** `app.onegodian.com/`
- **Next.js routes:** `app.onegodian.com/app/`
- **Shared app code:** `app.onegodian.com/lib/`, `app.onegodian.com/components/`
- **Prisma:** `app.onegodian.com/prisma/`

This folder is the deployment unit for `app.onegodian.com`.

## Modules preserved
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

## Local setup
1. `cp .env.example .env`
2. Fill required variables (see below).
3. `npm install`
4. `npx prisma generate`
5. `npx prisma migrate dev --name init`
6. `npm run prisma:seed`
7. `npm run dev`

## Required production environment variables
```bash
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://app.onegodian.com
AUTH_TRUST_HOST=true
```

Optional (when enabled):
```bash
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=https://app.onegodian.com
```

Generate a secure auth secret:
```bash
openssl rand -base64 32
```

## Build gate (must pass before deploy)
```bash
npm install
npm run lint
npm run build
```

## Prisma deploy commands
```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

## Deploy option A: Vercel (recommended)
1. Import `app.onegodian.com` as the project root.
2. Set environment variables from `.env.example` in Vercel Project Settings.
3. Confirm build command: `npm run build`.
4. Confirm start command: `npm run start` (Vercel manages runtime automatically).
5. Add custom domain: `app.onegodian.com`.
6. DNS record:
   - Type `CNAME`
   - Name `app`
   - Value `<your-project>.vercel.app`
7. SSL is auto-managed by Vercel.

## Deploy option B: Hostinger VPS
Prerequisites:
- Node.js installed
- Git installed
- PM2 installed
- Nginx reverse proxy
- SSL certificate (Certbot)
- PostgreSQL (local or external)

Deploy:
```bash
npm install
npm run build
npx prisma migrate deploy
npx prisma db seed
pm2 start npm --name onegodian-app -- start
pm2 save
```

DNS for VPS:
- Type `A`
- Name `app`
- Value `<your-vps-ip>`

Nginx should reverse proxy HTTPS traffic to the running Next.js process.

## First production checklist
- Build passes
- Domain resolves correctly
- SSL certificate active (`https://app.onegodian.com`)
- `/dashboard` loads
- `/planets` loads
- `/registry` loads
- `/tools` loads
- `/admin` protected/hidden
- No secrets committed to git
- Database connectivity confirmed
