# onegodian-app

Monorepo normalized with a single deployable Next.js app at:

- `apps/web` ✅ (only deployable Next.js root)

## Repository layout (target)

- `apps/web` — Next.js production app
- `packages` — shared packages
- `plugins` — WordPress plugin scaffold(s)
- `docs` — project documentation

## Deploying `apps/web`

### 1) Install dependencies

```bash
cd apps/web
npm install
```

### 2) Configure environment

```bash
cp .env.example .env
```

Set production values:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NODE_ENV=production`

### 3) Prisma setup

```bash
npx prisma generate
# For first deployment / schema apply:
npx prisma migrate deploy
```

### 4) Validate locally

```bash
npm run lint
npm run build
npm run start
```

### 5) Production start command

```bash
npm run build && npm run start
```

## Preserved domain content

- Planets routes/data (ODIN-PR)
- Moons systems route/data
- Prisma schema and migrations
- Reusable UI components
- WordPress plugin scaffold in `plugins/onegodian-capital-plugin`
