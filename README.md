# qrv-execution-interface

`qrv-execution-interface` consolidates the QR-V public verification portal and the registry-backed API into one modular Node.js service. This resolves the recent branch-divergence problem by preserving the newer `/src` application layout while restoring the registry routes, Postgres-backed services, and migration/bootstrap workflow that were introduced on the registry branch.

## What this merge keeps

- Modular `/src` application structure and clean server bootstrap.
- Public verification portal routes for `verify.qrv.network`.
- Registry API routes and Postgres-backed services for `api.qrv.network` style workflows.
- A migration/bootstrap path so the registry schema can be initialized deterministically.
- Shared deployment configuration for portal, API, and database connectivity.

## Runtime layout

```text
qrv-execution-interface/
├── docs/
│   └── architecture.md
├── migrations/
│   └── 001_initialize_registry.sql
├── public/
│   ├── css/
│   └── js/
├── scripts/
│   └── init-db.js
├── src/
│   ├── controllers/
│   │   ├── apiHealthController.js
│   │   ├── healthController.js
│   │   ├── registryController.js
│   │   └── verificationController.js
│   ├── routes/
│   │   ├── apiRoutes.js
│   │   ├── apiVerificationRoutes.js
│   │   ├── index.js
│   │   ├── recordsRoutes.js
│   │   └── verificationRoutes.js
│   ├── services/
│   │   ├── databaseService.js
│   │   ├── registryService.js
│   │   └── verificationService.js
│   ├── utils/
│   │   ├── qrvid.js
│   │   └── recordId.js
│   ├── views/
│   └── app.js
├── .env.example
├── Dockerfile
├── package.json
├── server.js
└── README.md
```

## Portal routes

- `GET /` renders the manual QRVID entry page.
- `POST /verify` accepts a QRVID and redirects to the result page.
- `GET /verify/:qrvid` renders a verification result using the configured API base URL.
- `GET /:qrvid` supports direct QR redirect resolution.
- `GET /health` returns portal process health.

## Registry/API routes

- `GET /api/health` returns registry health and database status.
- `GET /api/test-db` runs a database connectivity probe.
- `POST /api/records` creates a registry record.
- `GET /api/verify/:qrvid` resolves a QRVID directly from Postgres-backed registry data.

## Environment variables

Copy `.env.example` to `.env` and configure all relevant values:

```env
PORT=3000
NODE_ENV=development
API_BASE_URL=https://api.qrv.network
VERIFY_BASE_URL=https://verify.qrv.network
DATABASE_URL=postgres://username:password@hostname:5432/database
DATABASE_SSL_ENABLED=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

### Notes

- `API_BASE_URL` is used by the portal when it calls an upstream verification API.
- `VERIFY_BASE_URL` is used by the registry API when it returns public verification links.
- `DATABASE_URL` is required for registry persistence and health probes.
- SSL query parameters are stripped from `DATABASE_URL` so pool-level SSL settings remain authoritative.

## Local development

```bash
npm install
cp .env.example .env
npm run db:init
npm run dev
```

## Production startup

```bash
npm install --omit=dev
npm run db:init
npm start
```

## Checks

```bash
npm run check
```

## Why this resolves the merge blocker

The earlier registry work and the later portal work both changed core entrypoints like `server.js`, `src/app.js`, `.env.example`, `README.md`, and `package.json`. Instead of dropping one side of the conflict, this repository now keeps:

- the portal's modular application shell;
- the registry branch's database-backed services and schema bootstrap;
- merged dependency and environment configuration.

That gives you a controlled consolidation point rather than a destructive conflict resolution.

## License

MIT
