# qrv-registry

`qrv-registry` is the authoritative PostgreSQL-backed registry layer for `registry.qrv.network`, the canonical datastore service in the QR-V™ Global Verification Network.

It persists and serves canonical verification records used by the API layer and verification portals. This repository is intentionally backend-first and production-oriented. It is designed to provide deterministic lookup, lifecycle-aware record management, institutional auditability, and a stable datastore foundation for future auth, audit, and multi-tenant issuer controls.

## Architecture Role

```text
Issuer Portal → API Layer → Registry Layer → Verification Portal
```

- **Subdomain:** `registry.qrv.network`
- **Function:** canonical datastore
- **Primary database:** PostgreSQL
- **Primary responsibility:** authoritative storage and retrieval of QR-V records, issuer metadata, hashes, and audit events

## Core Capabilities

- canonical QR-V registry storage in PostgreSQL
- QRVID generation for deterministic lookup
- SHA-256 canonical hash generation from normalized payload data
- issuer metadata persistence
- certificate-oriented record support with extensible metadata
- lifecycle state transitions including revocation without hard deletes
- write-path audit logging
- JSON APIs for downstream verification services
- migration-based schema management
- Docker-ready local and deployment workflow

## Repository Structure

```text
qrv-registry/
├── docs/
│   ├── api.md
│   ├── architecture.md
│   └── data-model.md
├── migrations/
│   └── 001_initial_registry.sql
├── scripts/
│   ├── migrate.js
│   └── seed.js
├── sql/
│   └── schema.sql
├── src/
│   ├── config/
│   │   ├── env.js
│   │   └── logger.js
│   ├── controllers/
│   │   ├── healthController.js
│   │   ├── issuerController.js
│   │   └── registryController.js
│   ├── db/
│   │   ├── migrator.js
│   │   └── pool.js
│   ├── middleware/
│   │   ├── cors.js
│   │   ├── errorHandler.js
│   │   ├── requestLogger.js
│   │   └── validate.js
│   ├── models/
│   │   ├── auditModel.js
│   │   ├── issuerModel.js
│   │   └── registryModel.js
│   ├── routes/
│   │   ├── healthRoutes.js
│   │   └── registryRoutes.js
│   ├── services/
│   │   ├── healthService.js
│   │   ├── issuerService.js
│   │   └── registryService.js
│   ├── utils/
│   │   ├── appError.js
│   │   ├── hash.js
│   │   └── qrvid.js
│   ├── app.js
│   └── server.js
├── tests/
│   ├── hash.test.js
│   └── qrvid.test.js
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── LICENSE
├── package.json
└── README.md
```

## Environment Variables

Create a `.env` file from `.env.example`.

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | yes | HTTP port for the Express service |
| `DATABASE_URL` | yes | PostgreSQL connection string for the canonical registry datastore |
| `NODE_ENV` | yes | Environment name such as `development` or `production` |
| `REGISTRY_BASE_URL` | yes | Base URL for the registry service |
| `ALLOWED_ORIGINS` | yes | Comma-delimited list of allowed browser origins |

Example:

```env
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/qrv_registry
NODE_ENV=development
REGISTRY_BASE_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Setup

### Local development

```bash
npm install
cp .env.example .env
npm run migrate
npm run seed
npm run dev
```

### Production-style startup

```bash
npm install --omit=dev
npm run migrate
npm start
```

### Docker Compose

```bash
docker compose up --build
```

The compose stack provisions PostgreSQL and starts the registry service after migrations are applied.

## Database Migrations

This repository uses SQL migration files in `/migrations` and a lightweight Node-based migration runner.

Apply migrations:

```bash
npm run migrate
```

Load sample development data:

```bash
npm run seed
```

The canonical bootstrap schema is also mirrored in `sql/schema.sql` for operational review and onboarding.

## Initial Data Model

The initial schema includes:

- `qr_objects`
- `qr_issuers`
- `qr_certificates`
- `qr_hash_registry`
- `qr_audit_log`
- `schema_migrations`

See `docs/data-model.md` and `sql/schema.sql` for details.

## API Endpoints

### `GET /health`
Returns service and database health.

### `GET /registry/:qrvid`
Returns the canonical registry record for a QRVID.

### `POST /registry/create`
Creates a canonical QR-V record. On creation, the service generates:

- a QRVID
- a SHA-256 canonical hash
- lifecycle status
- timestamps
- an audit log entry

Example request:

```json
{
  "recordType": "certificate",
  "issuerId": "3db8d7d5-fb13-4aad-969d-724e53e9d30a",
  "subjectName": "Jane Citizen",
  "assetName": "Identity Verification Certificate",
  "description": "Canonical QR-V certificate record",
  "actionActor": "issuer-portal",
  "metadata": {
    "source": "issuer-portal"
  },
  "certificate": {
    "certificateNumber": "CERT-1001",
    "issuedTo": "Jane Citizen",
    "issuedDate": "2026-03-19",
    "expiryDate": "2027-03-19",
    "metadata": {
      "jurisdiction": "global"
    }
  }
}
```

### `POST /registry/issuer/create`
Creates an issuer record.

Example request:

```json
{
  "issuerName": "QR-V Trust Authority",
  "issuerCode": "QRV-TA",
  "websiteUrl": "https://issuer.qrv.network",
  "contactEmail": "registry@qrv.network",
  "actionActor": "platform-admin"
}
```

### `GET /registry/issuers/:id`
Returns issuer metadata by UUID.

### `POST /registry/:qrvid/revoke`
Transitions a record to `revoked` and appends an audit log entry. Records are never hard-deleted through this API.

Example request:

```json
{
  "actionActor": "platform-admin"
}
```

### `GET /registry/:qrvid/audit`
Returns the audit trail for a QRVID.

## Example cURL Commands

```bash
curl http://localhost:3000/health
```

```bash
curl http://localhost:3000/registry/QRV-20260319000000-ABCDEF12
```

```bash
curl -X POST http://localhost:3000/registry/issuer/create \
  -H 'Content-Type: application/json' \
  -d '{
    "issuerName": "QR-V Trust Authority",
    "issuerCode": "QRV-TA",
    "websiteUrl": "https://issuer.qrv.network",
    "contactEmail": "registry@qrv.network"
  }'
```

```bash
curl -X POST http://localhost:3000/registry/create \
  -H 'Content-Type: application/json' \
  -d '{
    "recordType": "certificate",
    "subjectName": "Jane Citizen",
    "assetName": "Identity Verification Certificate"
  }'
```

## Extensibility Direction

The codebase is intentionally organized so it can later support:

- authentication and service-to-service authorization
- richer audit event capture and compliance workflows
- multi-tenant issuer partitioning and policy enforcement
- additional record families such as identity, product, and document registries
- asynchronous event propagation to other QR-V network components

## Git Initialization and GitHub Push Commands

If you are creating this as a brand-new repository on your workstation, these are the exact commands to initialize Git, commit, and push:

```bash
mkdir qrv-registry
cd qrv-registry
git init
git add .
git commit -m "feat: initialize qrv-registry service"
git branch -M main
git remote add origin git@github.com:<your-org-or-user>/qrv-registry.git
git push -u origin main
```
