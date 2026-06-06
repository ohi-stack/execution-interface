# OneGodian App (app.onegodian.com)

The OneGodian App is the polished public/member-facing Next.js surface for unified access to identity, systems, records, education, commerce, media, verification, tools, and OMOS runtime awareness.

## App structure

- `src/app/layout.tsx` installs the public OneGodian shell, global metadata, and responsive navigation.
- `src/app/page.tsx` renders the production homepage with dashboard, ecosystem, and OMOS entry points.
- `src/app/(app)/*/page.tsx` contains the primary member-facing routes generated from `src/data/app-pages.json`.
- `src/app/certificates/page.tsx` exposes the certificates route at `/certificates`.
- `src/components/AppShell.tsx` provides the mobile-safe max-width container, premium background, footer, and safe bottom spacing.
- `src/components/Navigation.tsx` provides desktop navigation, horizontal mobile section navigation, and bottom mobile tabs.
- `src/components/PageRenderer.tsx` renders page content from `src/data/app-pages.json`.
- `src/components/DashboardCard.tsx` renders reusable premium dashboard modules with status badges and Open buttons.
- `src/components/EcosystemMap.tsx` renders public-safe ecosystem map cards.
- `src/components/RuntimeHealthWidget.tsx` fetches OMOS health and manifest status client-side and fails gracefully when OMOS is unavailable.

## Primary routes

- `/dashboard`
- `/ecosystem`
- `/omos`
- `/registry`
- `/tools`
- `/members`
- `/certificates`
- `/products`
- `/media`
- `/settings`
- `/docs`

## Public APIs

- `/api/health`
- `/api/manifest`
- `/api/tools`
- `/api/stats`

## Design system

The app uses a mobile-first premium OneGodian visual system:

- dark navy/black backgrounds
- gold accents
- purple/cyan highlights
- rounded glass cards
- responsive spacing and safe mobile widths
- bottom mobile navigation for Home, Dashboard, OMOS, Tools, and More

## Boundaries

This app is public/member-facing only. Internal ACC, operator, and admin controls must stay outside this app experience and must not be linked from the public navigation.
