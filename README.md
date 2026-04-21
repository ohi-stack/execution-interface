# onegodian-api

Production-ready V1 TypeScript + Express API baseline for deployment on Hostinger Node hosting.

## API Endpoints

- `GET /`
- `GET /health`
- `GET /ready`
- `GET /v1/status`
- `GET /v1/definition`
- `POST /execute`

## Prerequisites

- Node.js `20.x` (recommended for Hostinger Node deployments)
- npm `10+`

## Install

```bash
npm install
```

## Environment Setup

Copy and configure environment variables:

```bash
cp .env.example .env
```

`.env.example` values:

```env
PORT=3000
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
```

## Local Development

Run in watch mode:

```bash
npm run dev
```

## Build

Compile TypeScript to `dist/`:

```bash
npm run build
```

## Start (Production Runtime)

Run compiled output:

```bash
npm start
```

The server binds to `process.env.PORT`.

## `/execute` Contract

### Request

```json
{
  "task": "required non-empty string",
  "agent": "optional",
  "metadata": {}
}
```

### Responses

- `400` when `task` is missing or invalid
- `200` when `task` is present and valid

## Hostinger Deployment (Node Hosting)

Use the following steps as-is for a small production deployment.

### 1) Create Node app in Hostinger hPanel

- Go to **Websites → Manage → Advanced → Node.js**
- Create a Node.js app with:
  - **Node version:** `20.x`
  - **Application root:** project folder (for example `onegodian-api`)
  - **Startup file/command:** `npm start`

### 2) Upload project files

Upload the repository contents to your app root (via Git deployment, File Manager, or SFTP).

### 3) Install dependencies on server

In Hostinger terminal (inside app root):

```bash
npm install
```

### 4) Build TypeScript

```bash
npm run build
```

### 5) Configure environment variables in hPanel

Set the following variables in Node app settings:

- `NODE_ENV=production`
- `PORT=<Hostinger assigned port>` (or keep Hostinger-managed value)
- `CORS_ORIGIN=https://your-frontend-domain.com`
- `LOG_LEVEL=info`

### 6) Start / Restart application

Use the hPanel Node app controls or run:

```bash
npm start
```

### 7) Health-check after deploy

Open:

- `https://<your-domain>/health`
- `https://<your-domain>/ready`

Expected: HTTP `200` JSON responses.

## Operational Notes

- Security headers enabled via `helmet`
- CORS allowlist is environment-driven via `CORS_ORIGIN` (comma-separated origins supported)
- Request body limit set with `express.json({ limit: "1mb" })`
- Centralized 404 and error handlers included
- Malformed JSON returns structured `400` and does not crash the process
- Graceful shutdown is implemented for `SIGINT` and `SIGTERM`
