# INSTRYX Starter

Node/TypeScript starter for INSTRYX as a QRV protocol-side orchestration service.

## Run locally

1. Copy env file

```bash
cp .env.example .env
```

2. Install

```bash
npm install
```

3. Start API

```bash
npm run dev
```

4. Start worker in another terminal

```bash
npm run build
npm run worker
```

## Hostinger deployment settings

- Root directory: `./`
- Install command: `npm install`
- Build command: `npm run build`
- Entry file: `dist/index.js`
- Node version: `20.x`

Environment variables:

```env
NODE_ENV=production
PORT=4010
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-password
JWT_SECRET=your-long-secret
IDENTITY_ISSUER=https://identity.quantumohi.com
SERVICE_NAME=instryx.qrv.network
```
