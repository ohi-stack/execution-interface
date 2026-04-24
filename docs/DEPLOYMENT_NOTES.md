# Deployment Notes

## Runtime
- Start command: `npm start`
- Build command: `npm run build`
- Health endpoint: `GET /health`

## Environment
- `PORT` (default `3000`)
- `QRV_API_BASE_URL` (primary API base URL for issuer pages/forms)
- `NEXT_PUBLIC_API_URL` (fallback API URL if `QRV_API_BASE_URL` is not set)
- `CORS_ORIGINS` (comma-separated allowed origins)
- `EXECUTE_API_KEY` (required to enable `POST /execute`)
- `NODE_ENV` (`production` in deployed environments)

## Hostinger-compatible deployment flow
1. Upload the repository contents (or pull from Git) to your Hostinger Node.js application directory.
2. In the Hostinger Node.js panel, set startup file to `server.js`.
3. Install dependencies:
   ```bash
   npm ci
   ```
4. Build TypeScript output:
   ```bash
   npm run build
   ```
5. Configure environment variables in Hostinger:
   - `NODE_ENV=production`
   - `PORT=<hostinger-assigned-port>`
   - `QRV_API_BASE_URL=https://<your-api-host>`
   - Optional: `CORS_ORIGINS=https://<your-domain>`
   - Optional: `EXECUTE_API_KEY=<strong-secret>`
6. Restart the Hostinger Node.js app.
7. Verify routes:
   - `/`
   - `/login`
   - `/dashboard`
   - `/certificates`
   - `/issue`
   - `/health`

## Public Entry Endpoint
- `GET /v1/definition`

## Protocol Integration Endpoint
- `POST /execute`
