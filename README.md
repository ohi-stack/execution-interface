# QR-V Verification API

QR-V Verification API is a production-ready Node.js and Express backend for creating QR-based verification records and validating them through a public verification endpoint.

The service is designed to be deployed at `https://api.qrv.network` and to generate verification links that resolve through `https://verify.qrv.network`.

## Features

- Create QR-V verification records with secure crypto-generated IDs
- Verify stored records through a public lookup endpoint
- Health monitoring endpoint for uptime checks and deployment probes
- Environment-based configuration with `.env`
- In-memory registry for MVP deployment without database dependencies
- ESM-based Node.js project structure with separated routes, controllers, services, and utilities

## Project Structure

```text
qrv-api/
├── server.js
├── routes/
│   ├── records.js
│   └── verify.js
├── controllers/
│   ├── recordsController.js
│   └── verifyController.js
├── services/
│   └── registryService.js
├── utils/
│   └── idGenerator.js
├── .env.example
├── package.json
└── README.md
```

## Requirements

- Node.js 18 or newer
- npm 9 or newer

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

For production:

```bash
npm install --omit=dev
npm start
```

## Environment Variables

Create a `.env` file based on `.env.example`.

```env
PORT=3000
NODE_ENV=production
VERIFY_BASE_URL=https://verify.qrv.network
```

## API Endpoints

### GET `/health`

Health check endpoint.

**Response**

```json
{
  "ok": true
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

## Example cURL Requests

### Health Check

```bash
curl -X GET http://localhost:3000/health
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

## Deployment Instructions (Hostinger Node Setup)

1. Create a new Node.js application in Hostinger hPanel.
2. Set the application root to the repository directory.
3. Upload the project files or connect the GitHub repository.
4. Set the startup file to `server.js`.
5. Configure environment variables in Hostinger:
   - `PORT=3000` or the port assigned by Hostinger
   - `NODE_ENV=production`
   - `VERIFY_BASE_URL=https://verify.qrv.network`
6. Run `npm install --omit=dev` on the server.
7. Start or restart the Node.js application from hPanel.
8. Confirm the API is live by visiting `https://api.qrv.network/health`.

## Domain Mapping

- API domain: `api.qrv.network`
- Verification base URL: `https://verify.qrv.network`

Point `api.qrv.network` to the Hostinger application and ensure reverse proxy or Node app routing forwards traffic to the configured `PORT`.

## Operational Notes

- Records are stored in memory only for the MVP version.
- Restarting the Node.js process clears all created verification records.
- The API does not require any database connection and will run immediately after installation.

## License

MIT
