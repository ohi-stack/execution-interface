# OMOS Deployment

OMOS runs as one Next.js application with three modes: public website, authenticated developer console, and restricted administration panel. Set `OMOS_SESSION_SECRET`, `OMOS_SESSION_TTL_SECONDS`, and `OMOS_AUTH_USERS` as production environment variables only. Checkout remains on OneGodian.com; this app does not become a store.

Use UTC for system records. Gregorian/civil dates are legally controlling; OTS-V5 may be rendered only as supplemental derived display.
