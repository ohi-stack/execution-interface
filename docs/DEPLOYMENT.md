# OMOS Deployment

## Requirements
- Node.js 20+
- Environment variables from `.env.example`

## Deploy
1. `npm install`
2. `npm run build`
3. `npm run start`

## Verify
- `npm run test:smoke`
- Health: `/api/health`
- Manifest: `/api/manifest`
