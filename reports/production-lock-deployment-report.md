# Production Lock Deployment Report

Generated: 2026-06-04
Target deployment URL: https://app.onegodian.com
Repository locked: ohi-stack/onegodian-app-deploy
Audited source repository: ohi-stack/onegodian-app (content manifest and ecosystem manifest consolidated into this deploy repository)

## Route Status

| Route | Status | Notes |
| --- | --- | --- |
| `/dashboard` | Active | Verified locally with production build. |
| `/ecosystem` | Active | Verified locally with production build. |
| `/registry` | Active | Verified locally with production build. |
| `/members` | Active | Verified locally with production build. |
| `/products` | Active | Verified locally with production build. |
| `/media` | Active | Verified locally with production build. |
| `/capital` | Active | Verified locally with production build. |
| `/omos` | Active | Verified locally with production build. |
| `/learning` | Active | Verified locally with production build. |

## API Status

| API | Status | Notes |
| --- | --- | --- |
| `/api/health` | Active | Returns canonical app health, production routes, production APIs, and timestamp. |
| `/api/manifest` | Active | Returns runtime manifest, app content manifest, ecosystem manifest, route/API lists, and bridge metadata. |
| `/api/tools` | Active | Returns production tool registry data. |
| `/api/stats` | Active | Returns route/API/bridge counts and route/API status maps. |

## Bridge Status

| Bridge | File | Status Model | Environment Support |
| --- | --- | --- | --- |
| Platform | `src/lib/bridges/platform.ts` | `configured`, `missing-wordpress-url`, or `missing-app-key` | `WORDPRESS_API_URL`, `OMOS_APP_KEY`, `X-OMOS-App-Key` |
| Members | `src/lib/bridges/members.ts` | WordPress member records bridge and status helper | `WORDPRESS_API_URL`, `OMOS_APP_KEY`, `X-OMOS-App-Key` |
| Capital | `src/lib/bridges/capital.ts` | WordPress capital records bridge and status helper | `WORDPRESS_API_URL`, `OMOS_APP_KEY`, `X-OMOS-App-Key` |

## Build Status

| Check | Status |
| --- | --- |
| `npm run lint` | Passed |
| `npm run type-check` | Passed |
| `npm run build` | Passed |
| Local production route/API verification with `npx next start -p 4023` and `curl` | Passed |

## Deployment Notes

- The production build is ready for the main branch deployment target `app.onegodian.com`.
- This environment does not expose production hosting credentials, so the deploy step must be completed by the configured CI/CD or hosting provider for `ohi-stack/onegodian-app-deploy`.
- The app now defaults runtime URLs toward `https://app.onegodian.com` and supports WordPress bridge configuration with `WORDPRESS_API_URL` and `OMOS_APP_KEY`.
