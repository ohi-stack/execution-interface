# OneGodian App (execution-interface)

Production-ready Next.js runtime for app.onegodian.com.

## Module map (current)

Primary routes:
- `/`, `/dashboard`, `/ecosystem`, `/registry`, `/systems`, `/members`, `/developers`
- `/capital`, `/capital/instruments`, `/capital/valuation`, `/capital/intake`, `/capital/payments`, `/capital/licensing`, `/capital/api`
- `/omos`, `/time`, `/odin`, `/odin/planetary-registry`
- `/galaxy`, `/galactic-canon`, `/life-intelligence`
- `/algorithm`, `/algorithm/protocol`, `/algorithm/experience`, `/algorithm/community`, `/algorithm/orientation`
- `/belief-mapper`, `/learn`, `/standards/visual-covers`, `/institutional`, `/media/divine-9`, `/games`, `/games/bingo`

## Environment variables

Required core values:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

OMOS bridge values:
- `OMOS_REST_BASE_URL`
- `OMOS_API_BASE_URL`
- `OMOS_APP_BRIDGE_KEY`
- `OMOS_APP_DASHBOARD_URL`
- `OMOS_MODULE_SLUG`

## Hostinger / Node deployment checklist

1. Use Node.js 20.x.
2. Run `npm install`.
3. Set all environment variables (including OMOS bridge keys).
4. Run `npm run lint` and `npx tsc --noEmit`.
5. Run `npm run build`.
6. Start using `npm run start`.
7. Verify `/dashboard`, `/ecosystem`, `/registry`, `/omos`, `/capital`, `/games/bingo`, and `/api/omos/llm/chat`.

## Known limitations

- `/api/omos/llm/chat` requires external OMOS API availability and valid bridge key.
- OMOS dashboard currently displays bridge configuration state and endpoint availability, but does not yet include request history telemetry.
