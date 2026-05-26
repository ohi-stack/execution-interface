# Hostinger deployment checklist (console.onegodian.com)

Use this checklist to **create or restore** the internal OneGodian Console deployment without touching the live app deployment.

## 1) Keep the app deployment unchanged

Do **not** modify the production app deployment:

- Domain: `app.onegodian.com`
- Repository: `ohi-stack/onegodian-app-deploy`
- Purpose: public/member-facing OneGodian App

## 2) Create or restore a separate console deployment

In Hostinger, provision a separate Node.js/Next.js app for:

- Domain: `console.onegodian.com`
- Preferred repository: `ohi-stack/ohi-control-plane`
- Temporary fallback repository (if needed): `ohi-stack/execution-interface`
- Branch: `main`

Required build/runtime settings:

- Framework preset: `Next.js`
- Node version: `20.x`
- Root directory: `./`
- Build command: `npm run build`
- Package manager: `npm`
- Output directory: `.next`
- Start command: `npm run start`

## 3) Console-only environment variables

Apply these values to the **console deployment only**:

```dotenv
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
NEXT_PUBLIC_APP_NAME=OneGodian Console
NEXT_PUBLIC_APP_TITLE=OneGodian Console
NEXT_PUBLIC_APP_DOMAIN=console.onegodian.com
NEXT_PUBLIC_APP_URL=https://console.onegodian.com
NEXT_PUBLIC_APP_TYPE=internal-control-plane
NEXT_PUBLIC_APP_VERSION=0.1.0
NEXT_PUBLIC_BUILD_MARKER=2026.05.25-console-prod
NEXT_PUBLIC_PRIMARY_DOMAIN=https://console.onegodian.com
NEXT_PUBLIC_APP_DASHBOARD_URL=https://app.onegodian.com
NEXT_PUBLIC_PUBLIC_SITE_URL=https://onegodian.org
NEXT_PUBLIC_STORE_URL=https://onegodian.com
NEXT_PUBLIC_UNIVERSITY_URL=https://u.onegodian.org
NEXT_PUBLIC_GALAXY_URL=https://galaxy.onegodian.com
NEXT_PUBLIC_OMOS_URL=https://omos.onegodian.com
NEXT_PUBLIC_CAPITAL_URL=https://capital.onegodian.com
NEXT_PUBLIC_DOMAIN_ROLE=internal-command-console
NEXT_PUBLIC_ENABLE_CONSOLE_ROUTES=true
NEXT_PUBLIC_ENABLE_ADMIN_ROUTES=true
NEXT_PUBLIC_ENABLE_DEPLOYMENTS=true
NEXT_PUBLIC_ENABLE_PLUGINS=true
NEXT_PUBLIC_ENABLE_API_STATUS=true
NEXT_PUBLIC_ENABLE_SYSTEM_HEALTH=true
NEXT_PUBLIC_ENABLE_LOGS=true
NEXT_PUBLIC_ENABLE_REGISTRY_ADMIN=true
NEXT_PUBLIC_ENABLE_MEMBER_ADMIN=true
NEXT_PUBLIC_ENABLE_CERTIFICATE_ADMIN=true
NEXT_PUBLIC_API_BASE_URL=https://console.onegodian.com/api
NEXT_PUBLIC_HEALTH_ENDPOINT=/api/health
NEXT_PUBLIC_MANIFEST_ENDPOINT=/api/manifest
NEXT_PUBLIC_TOOLS_ENDPOINT=/api/tools
NEXT_PUBLIC_STATS_ENDPOINT=/api/stats
NEXT_PUBLIC_STATUS_ENDPOINT=/api/status
NEXTAUTH_URL=https://console.onegodian.com
NEXTAUTH_SECRET=
AUTH_SECRET=
DATABASE_URL=
```

## 4) App-only guardrails

Keep the app deployment app-only:

```dotenv
NEXT_PUBLIC_APP_NAME=OneGodian App
NEXT_PUBLIC_APP_DOMAIN=app.onegodian.com
NEXT_PUBLIC_APP_TYPE=member-facing-app
NEXT_PUBLIC_DISABLE_CONSOLE_ROUTES=true
NEXT_PUBLIC_DISABLE_ADMIN_ROUTES=true
```

## 5) Post-deploy verification

After deploy, verify:

1. `https://console.onegodian.com` resolves to the console deployment.
2. Internal control-plane wording is visible.
3. Console/admin/deployments/plugins/status/health/logs routes are enabled.
4. `https://app.onegodian.com` still points to `ohi-stack/onegodian-app-deploy` and remains live.
