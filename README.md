# OneGodian App Monorepo

Production target: **`apps/web`** (the `app.onegodian.com` Next.js application).

## Repository structure

```text
onegodian-app/
├── apps/
│   └── web/                                  # app.onegodian.com Next.js app
├── plugins/
│   └── wordpress/
│       └── obp1-certificate-generator/       # OBP-1 WordPress scaffold
├── packages/                                  # shared modules/data (create as needed)
├── docs/
├── package.json
└── .gitignore
```

## Architecture decision

- `apps/web` owns its Next.js runtime, Prisma schema, and seed data.
- WordPress plugin code is isolated under `plugins/wordpress`.
- Root scripts proxy to `apps/web` to avoid deployment ambiguity.
- Legacy/other app folders can continue to exist, but deployment for `app.onegodian.com` must point at `apps/web`.

## Root commands (from repository root)

Install app dependencies:

```bash
npm run install:web
```

Run development server:

```bash
npm run dev
```

Lint:

```bash
npm run lint
```

Build:

```bash
npm run build
```

Prisma commands:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Direct app commands

You can also run commands directly in the app:

```bash
cd apps/web
npm install
npm run dev
```
