# app.onegodian.com Deployment Guide

## Deployable app root
- **Root directory:** `app.onegodian.com`
- All commands below are run from this directory.

## Build commands
```bash
npm ci
npm run lint
npm run build
npm run start
```

## Required environment variables
Set these in your deployment platform (Vercel project env vars or VPS `.env.production`):

- `NEXT_PUBLIC_APP_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `AUTH_TRUST_HOST`
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Vercel deployment steps
1. Push repository to GitHub.
2. In Vercel, create/import project.
3. Set **Root Directory** to `app.onegodian.com`.
4. Framework preset: **Next.js**.
5. Build command: `npm run build`.
6. Install command: `npm ci`.
7. Output directory: leave default (`.next`).
8. Add all required environment variables.
9. Deploy to preview, then promote to production.
10. In project domains, add `app.onegodian.com`.

## Hostinger / VPS deployment steps
1. Provision Node.js 20+ server and PostgreSQL.
2. Clone repo on server.
3. `cd app.onegodian.com`
4. Create `.env.production` with required variables.
5. Install and build:
   ```bash
   npm ci
   npm run build
   ```
6. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```
7. Start app:
   ```bash
   npm run start
   ```
8. Recommended process manager (PM2):
   ```bash
   pm2 start npm --name app-onegodian -- start
   pm2 save
   ```
9. Put Nginx/Apache reverse proxy in front of Node (port 3000).

## DNS instructions for app.onegodian.com
Use your DNS provider zone for `onegodian.com`:

### If using Vercel
- Add `app` as a CNAME to `cname.vercel-dns.com`.
- Verify domain in Vercel dashboard.

### If using Hostinger/VPS
- Add `app` as an A record to your VPS public IPv4.
- Optional: add AAAA record for IPv6.
- Configure SSL (Let's Encrypt) on reverse proxy.

## Notes
- Do **not** commit production secrets to git.
- Keep `.env.example` as placeholder values only.
