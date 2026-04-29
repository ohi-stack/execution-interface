# Hostinger import and deployment settings

Use these settings for non-interactive deployment of the Next.js frontend.

- Framework: Next.js
- Node version: 20+
- Install command: `npm ci`
- Build command: `npm run build`
- Start command: `npm run start`

## Environment

Required public variable:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.onegodian.org
```

No backend secret variables are required for frontend lint/build.
