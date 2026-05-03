# onegodian-app-deploy

Hostinger-compatible deployment repository for **app.onegodian.com** using a standalone Next.js app at the repository root.

## Runtime

- **Node.js:** 20.x LTS (recommended on Hostinger Node.js hosting)
- **Package manager:** npm
- **Framework:** Next.js 14

## Repository root structure

This repository is intentionally flat for deployment:

- `package.json`
- `package-lock.json`
- `next.config.js`
- `tsconfig.json`
- `tailwind.config.ts`
- `postcss.config.js`
- `.env.example`
- `src/`
- `prisma/`
- `public/`

## Environment variables

1. Copy `.env.example` to `.env` in the server environment.
2. Set production values for all keys, especially:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to `https://app.onegodian.com`)

## Hostinger deployment steps

1. Create a Node.js application in Hostinger hPanel.
2. Set the application root to this repository root.
3. Upload repository files or connect Git deployment.
4. Set Node.js version to **20.x**.
5. Configure environment variables from `.env.example`.
6. Install dependencies:
   ```bash
   npm install
   ```
7. Build the app:
   ```bash
   npm run build
   ```
8. Start command:
   ```bash
   npm run start
   ```

## Local validation

```bash
npm install
npm run lint
npm run build
```
