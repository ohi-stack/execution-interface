# qrv-verify-portal / INSTRYX Starter

This repository now hosts the **INSTRYX protocol-side Node/TypeScript service scaffold** while retaining compatibility with existing QR-V CI expectations.

## What this branch adds

- TypeScript service entry at `src/index.ts` and Express app composition in `src/app.ts`.
- Queue-backed verify workflow using BullMQ + Redis.
- API routes: `/health`, `/verify`, `/jobs/:id`, `/menu`.
- Docker and docker-compose setup for API + worker + Redis.

## Runtime profile (INSTRYX)

- Port: `4010`
- Build output: `dist/index.js`
- Worker entry: `dist/queue/worker.js`

## Local run

```bash
cp .env.example .env
npm install
npm run dev
```

In another terminal:

```bash
npm run build
npm run worker
```

## CI compatibility

The repository CI workflow expects the following scripts, and they are provided in `package.json`:

- `npm run check`
- `npm run validate:enforcement`
- `npm test`

## Legacy note

The historic public portal shape (server-rendered verification UX) can still be maintained in separate routes/apps, but this scaffold focuses on orchestration-side service responsibilities.
