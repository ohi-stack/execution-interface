# qrv-verify-portal

`qrv-verify-portal` is the public verification resolution interface for the QR-V™ Global Verification Network. It is designed to run at `https://verify.qrv.network` and acts as the public-facing layer between a scanned QR-V identifier and the registry-backed verification API at `https://api.qrv.network`.

This repository intentionally implements a focused verification portal rather than a generic marketing website. The interface accepts QRVIDs, resolves them against the authoritative API, and renders deterministic verification results for institutional users.

## Role in the QR-V System

The portal sits in the public verification path:

```text
QR Scan → verify.qrv.network → api.qrv.network → registry → response → display result
```

### Service responsibilities

- Accept QR-V identifiers (QRVIDs) through a direct URL or manual entry.
- Validate and sanitize incoming identifiers before requesting data.
- Call `GET https://api.qrv.network/verify/:qrvid`.
- Render structured verification results for `VERIFIED`, `INVALID`, `REVOKED`, `EXPIRED`, and service-unavailable states.
- Present an authoritative, mobile-friendly interface with minimal client-side logic.

## How verification works

1. A user scans a QR code or opens a verification URL such as `/QRV-123456789`.
2. The portal sanitizes the QRVID and validates its format server-side.
3. The verification service requests `GET {NEXT_PUBLIC_API_URL}/verify/:qrvid`.
4. The portal normalizes the response payload and status.
5. The result page displays the verification state, issuer, record type, subject, timestamp, and truncated hash when available.
6. If the upstream API times out or becomes unreachable, the portal retries once and then renders a deterministic unavailable state.

## Architecture and project structure

```text
qrv-verify-portal/
├── docs/
│   └── architecture.md
├── public/
│   ├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
├── src/
│   ├── controllers/
│   │   ├── healthController.js
│   │   └── verificationController.js
│   ├── routes/
│   │   ├── index.js
│   │   └── verificationRoutes.js
│   ├── services/
│   │   └── verificationService.js
│   ├── utils/
│   │   └── qrvid.js
│   ├── views/
│   │   ├── indexView.js
│   │   ├── layout.js
│   │   └── resultView.js
│   └── app.js
├── .env.example
├── Dockerfile
├── package.json
├── server.js
└── README.md
```

## Routes

### `GET /`
Landing page with a QRVID input and a Verify button.

### `GET /:qrvid`
Automatically resolves a QRVID and renders the verification result.

### `GET /verify/:qrvid`
Explicit verification route that performs the same lookup and rendering.

### `POST /verify`
Form handler that accepts a pasted QRVID and redirects to `/verify/:qrvid`.


### `POST /v1/execute`
Normalizes execution requests into a standard envelope and returns `202 Accepted` with generated `execution_id`, `status`, and `trace_id`.

### `POST /api/v1/records`
Creates a V1 verification record with runtime schema validation and policy enforcement. Requires `x-actor-role` of `issuer` or `admin`.

### `GET /api/v1/verify/:qrvid`
Returns deterministic V1 statuses: `VERIFIED`, `REVOKED`, `EXPIRED`, `NOT_FOUND`.

### `POST /api/v1/records/:qrvid/revoke`
Revokes an existing record with runtime schema validation and policy enforcement. Requires `x-actor-role` of `admin`.

### `GET /health`
Returns:

```json
{
  "status": "ok",
  "service": "verify-portal"
}
```

## Environment variables

Copy `.env.example` to `.env` and configure as needed:

```env
PORT=3000
NEXT_PUBLIC_API_URL=https://api.qrv.network
NODE_ENV=development
```

## Local setup

### Requirements

- Node.js 18+
- npm 9+

### Install and run

```bash
npm install
cp .env.example .env
npm run dev
```

For a production-style local run:

```bash
npm install --omit=dev
npm start
```

Open `http://localhost:3000`.

## Deployment instructions

### Standard Node deployment

1. Provision a Node.js 18+ runtime.
2. Set environment variables:
   - `PORT`
   - `NEXT_PUBLIC_API_URL=https://api.qrv.network` (or `API_BASE_URL` for legacy compatibility)
   - `NODE_ENV=production`
3. Install dependencies with `npm install --omit=dev`.
4. Start the service with `npm start`.
5. Map the public domain `verify.qrv.network` to the running service.
6. Confirm `/health` responds with the expected JSON payload.

### Docker deployment

Build and run:

```bash
docker build -t qrv-verify-portal .
docker run --rm -p 3000:3000 --env-file .env qrv-verify-portal
```

## Security and reliability notes

- Client input is sanitized and validated before use.
- The portal never connects directly to a database.
- `api.qrv.network` is the verification data source for this portal, configured via `NEXT_PUBLIC_API_URL`.
- API timeouts trigger a single retry before showing an unavailable state.
- The service logs verification lookups for simple operational analytics.

## Running checks

```bash
npm run check
npm run validate:enforcement
npm test
```

## Git initialization and push commands

If you are starting from a fresh local clone or a new repository, use:

```bash
git init
git add .
git commit -m "Create QR-V verification portal"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```

If the repository is already initialized, use:

```bash
git add .
git commit -m "Create QR-V verification portal"
git push
```

## License

MIT
