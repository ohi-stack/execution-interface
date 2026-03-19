# QR-V Verification API

QR-V Verification API is a production-ready Node.js and Express backend for creating QR-based verification records and validating them through a public verification endpoint.

The service is designed to be deployed at `https://api.qrv.network` and to generate verification links that resolve through `https://verify.qrv.network`.

## Features

- Create QR-V verification records with secure crypto-generated IDs
- Verify stored records through a public lookup endpoint
- PostgreSQL-backed registry persistence with managed-SSL support
- Automatic schema bootstrap for `qr_objects`, `qr_certificates`, and `qr_audit_log`
- Health monitoring and database probe endpoints for uptime checks and deployment diagnostics
- Environment-based configuration with `.env`
- ESM-based Node.js project structure with separated routes, controllers, services, and utilities

## Project Structure

```text
qrv-api/
├── controllers/
│   ├── recordsController.js
│   └── verifyController.js
├── routes/
│   ├── records.js
│   └── verify.js
├── scripts/
│   └── init-db.js
├── services/
│   ├── databaseService.js
│   └── registryService.js
├── utils/
│   └── idGenerator.js
├── .env.example
├── package.json
├── server.js
└── README.md
```

## Requirements

- Node.js 18 or newer
- npm 9 or newer
- PostgreSQL 13 or newer

## Installation

```bash
npm install
cp .env.example .env
npm run db:init
npm run dev
```

For production:

```bash
npm install --omit=dev
npm run db:init
npm start
```

## Environment Variables

Create a `.env` file based on `.env.example`.

```env
PORT=3000
NODE_ENV=production
VERIFY_BASE_URL=https://verify.qrv.network
DATABASE_URL=postgres://username:password@hostname:5432/database
DATABASE_SSL_ENABLED=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

### Database configuration notes

- Set **one** canonical `DATABASE_URL` value for your Postgres instance.
- Do **not** append SSL query parameters such as `sslmode` or `sslrootcert` to `DATABASE_URL`; the application strips them so the pool-level SSL config remains authoritative.
- `DATABASE_SSL_REJECT_UNAUTHORIZED=false` is useful for managed Postgres providers that require SSL but present a certificate chain that is not locally trusted.

## API Endpoints

### GET `/health`

Health check endpoint with database connectivity status.

**Healthy response**

```json
{
  "ok": true,
  "database": "connected",
  "time": "2026-03-19T00:00:00.000Z"
}
```

**Database unavailable response**

```json
{
  "ok": false,
  "database": "unconfigured",
  "reason": "DATABASE_URL is not configured."
}
```

### GET `/test-db`

Runs `SELECT NOW()` against the configured PostgreSQL database.

**Response**

```json
{
  "time": "2026-03-19T00:00:00.000Z"
}
```

### POST `/records`

Creates a verification record.

**Request Body**

```json
{
  "assetName": "Certificate of Authenticity",
  "issuer": "QR-V Network",
  "description": "Digital verification record for a registered asset"
}
```

**Response**

```json
{
  "success": true,
  "id": "QRV-a1b2c3d4e5f6",
  "verifyUrl": "https://verify.qrv.network/QRV-a1b2c3d4e5f6"
}
```

### GET `/verify/:id`

Verifies whether a record exists.

**Verified Response**

```json
{
  "status": "VERIFIED",
  "record": {
    "id": "QRV-a1b2c3d4e5f6",
    "assetName": "Certificate of Authenticity",
    "issuer": "QR-V Network",
    "description": "Digital verification record for a registered asset",
    "status": "valid",
    "createdAt": "2026-03-19T00:00:00.000Z"
  }
}
```

**Not Found Response**

```json
{
  "status": "NOT_FOUND"
}
```

**Registry unavailable response**

```json
{
  "status": "UNAVAILABLE",
  "reason": "Registry not reachable. Please try again later."
}
```

## Database bootstrap and migrations

Run the schema bootstrap script before the first deployment and whenever you need to ensure the required tables exist:

```bash
npm run db:init
```

The bootstrap creates these tables if they do not exist already:

- `qr_objects`
- `qr_certificates`
- `qr_audit_log`

## Example cURL Requests

### Health Check

```bash
curl -X GET http://localhost:3000/health
```

### Database Probe

```bash
curl -X GET http://localhost:3000/test-db
```

### Create Record

```bash
curl -X POST http://localhost:3000/records \
  -H "Content-Type: application/json" \
  -d '{
    "assetName": "Certificate of Authenticity",
    "issuer": "QR-V Network",
    "description": "Digital verification record for a registered asset"
  }'
```

### Verify Record

```bash
curl -X GET http://localhost:3000/verify/QRV-a1b2c3d4e5f6
```

## Deployment Instructions (Hostinger / Vercel / managed Node)

1. Create or open your Node.js application in your hosting control panel.
2. Set the application root to the repository directory.
3. Upload the project files or connect the Git repository.
4. Configure environment variables in the hosting dashboard:
   - `PORT=3000` or the provider-assigned port
   - `NODE_ENV=production`
   - `VERIFY_BASE_URL=https://verify.qrv.network`
   - `DATABASE_URL=postgres://username:password@hostname:5432/database`
   - `DATABASE_SSL_ENABLED=true`
   - `DATABASE_SSL_REJECT_UNAUTHORIZED=false` when required by your provider
5. Run `npm install --omit=dev` on the server.
6. Run `npm run db:init` to create the required database tables.
7. Start or restart the Node.js application.
8. Confirm the API is live by visiting `https://api.qrv.network/health` and `https://api.qrv.network/test-db`.
9. Scan a QR-V ID and confirm the verification endpoint returns a verification payload instead of a `503`.

## Domain Mapping

- API domain: `api.qrv.network`
- Verification base URL: `https://verify.qrv.network`

Point `api.qrv.network` to the Hostinger application and ensure reverse proxy or Node app routing forwards traffic to the configured `PORT`.

## Operational Notes

- Records are stored in PostgreSQL instead of process memory.
- If the database connection is unavailable, the API returns a structured `503` response with `status: "UNAVAILABLE"`.
- Verification and creation requests append audit events to `qr_audit_log`.

## License

MIT
