# OneGodian Everything App Foundation

Next.js + TypeScript + Tailwind + Prisma foundation for `app.onegodian.com`.

## Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS (dark/futuristic baseline)
- Prisma + PostgreSQL
- Auth.js-ready dependencies and environment variables

## Local setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env template:
   ```bash
   cp .env.example .env
   ```
3. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
4. Create first migration:
   ```bash
   npm run prisma:migrate -- --name init
   ```
5. Run app:
   ```bash
   npm run dev
   ```

## Deployment notes
- Set production `DATABASE_URL`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET` in the host environment.
- Run Prisma migrations during CI/CD or release hook.
- Add Auth.js route handlers and provider configuration before production sign-in.
- Replace placeholders with module-specific APIs and authorization policies.
