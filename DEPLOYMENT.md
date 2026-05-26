# Hostinger Node Deployment — ONEGODIAN Surfaces

This deployment guide covers both OneGodian production surfaces and their DNS prerequisites.

## Surface separation

### App surface (`app.onegodian.com`)
- **Repository:** `ohi-stack/onegodian-app-deploy`
- **Purpose:** OneGodian App, public/member-facing experience layer
- **Required production URL:** `https://app.onegodian.com`
- **DNS requirement:** Create an `A` or `CNAME` record named `app`

### Console surface (`console.onegodian.com`)
- **Repository:** `ohi-stack/ohi-control-plane` (or designated console deployment repository)
- **Purpose:** OneGodian Control Plane / Console, operator-facing control layer
- **Required production URL:** `https://console.onegodian.com`
- **DNS requirement:** Create an `A` or `CNAME` record named `console`

> Do not document or expose console-only tools/features as app (`app.onegodian.com`) functionality.

## Critical DNS prerequisite for browser testing

Before any browser-based verification, both subdomains must resolve publicly:
- `app.onegodian.com`
- `console.onegodian.com`

If either DNS record is missing or still propagating, browser tests are not valid.

## Deployment checklist

Use this checklist for each release:

1. **DNS**
   - Confirm `app.onegodian.com` has an active `A` or `CNAME` record named `app`
   - Confirm `console.onegodian.com` has an active `A` or `CNAME` record named `console`
2. **SSL/TLS**
   - Verify certificates are issued and valid for both production URLs
3. **Build**
   - Run `npm install`
   - Run `npm run build`
4. **Start/Deploy**
   - Run `npm run start` (or platform equivalent)
5. **Route verification**
   - Verify app URL: `https://app.onegodian.com`
   - Verify console URL: `https://console.onegodian.com`
6. **Health checks**
   - App/API endpoints return expected status codes after deploy

## Troubleshooting

- **`ERR_NAME_NOT_RESOLVED`**
  - DNS record is missing, incorrect, or not yet propagated.
- **HTTP `404`**
  - DNS resolves, but routing/deployment target is incorrect.
- **HTTP `500`**
  - Deployment is reachable, but runtime/server-side failure exists.
- **SSL warning/certificate error**
  - DNS may resolve, but HTTPS certificate has not been issued/attached yet.

## Hostinger console recovery playbook

If `console.onegodian.com` shows as detached or not attached to a running deployment, follow the dedicated runbook:

- `docs/hostinger-console-deploy-checklist.md`

This runbook explicitly preserves the live `app.onegodian.com` deployment and restores the console as a separate Node/Next.js Hostinger app.
