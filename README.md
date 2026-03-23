# QR-V Verification Workspace

QR-V now includes two coordinated surfaces:

- a production-ready Node.js and Express verification API backend
- a Next.js issuer workspace that creates records and renders QR-ready outputs

The service is designed to be deployed with an API at `https://api.qrv.network`, a verification surface at `https://verify.qrv.network`, and an issuer-facing app that can sit in front of the API.

## Features

### Backend API

- Create QR-V verification records with secure crypto-generated IDs
- Verify stored records through a public lookup endpoint
- PostgreSQL-backed registry persistence with managed-SSL support
- Automatic schema bootstrap for `qr_objects`, `qr_certificates`, and `qr_audit_log`
- Health monitoring and database probe endpoints for uptime checks and deployment diagnostics

### Issuer workspace

- Next.js App Router UI for issuer record creation
- API proxy route that forwards requests to the Express backend
- QR pipeline with live preview, copy-to-clipboard, and PNG download
- Environment-based backend targeting for local development and deployment

## Project Structure

```text
qrv-workspace/
├── controllers/
├── routes/
├── scripts/
├── services/
├── utils/
├── issuer-ui/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── .env.example
│   └── package.json
├── .env.example
├── package.json
├── server.js
└── README.md
```

## Requirements

- Node.js 18 or newer
- npm 9 or newer
- PostgreSQL 13 or newer for persistence-backed API flows

## Installation

### API

```bash
npm install
cp .env.example .env
npm run db:init
npm run dev
```

### Issuer UI

```bash
cd issuer-ui
npm install
cp .env.example .env.local
npm run dev
```

The issuer UI proxies record creation through `/api/records` and forwards the request to `QRV_API_BASE_URL`.

## Environment Variables

### API `.env`

```env
PORT=3000
NODE_ENV=production
VERIFY_BASE_URL=https://verify.qrv.network
DATABASE_URL=postgres://username:password@hostname:5432/database
DATABASE_SSL_ENABLED=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

### Issuer UI `.env.local`

```env
QRV_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_QRV_API_BASE_URL=http://localhost:3000
```

## API Endpoints

### GET `/health`

Health check endpoint with database connectivity status.

### GET `/test-db`

Runs `SELECT NOW()` against the configured PostgreSQL database.

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

## Issuer workflow

1. Open the Next.js issuer app.
2. Enter the asset name, issuer, and description.
3. Submit the form to create the backend record.
4. Copy the generated verification URL or download the QR PNG.

## Database bootstrap and migrations

Run the schema bootstrap script before the first deployment and whenever you need to ensure the required tables exist:

```bash
npm run db:init
```

The bootstrap creates these tables if they do not exist already:

- `qr_objects`
- `qr_certificates`
- `qr_audit_log`
