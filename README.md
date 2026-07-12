# ACC™ Agent Command Console

Canonical repository: `ohi-stack/acc`  
Deploy target: <https://acc.onegodian.com>

ACC™ is the dedicated operator-facing command console for agent operations, task queues, workflow visibility, approval posture, deployment readiness, and audit views across the OneGodian operational ecosystem.

## Scope

ACC is an **interface only**. Authority remains with external services:

- **OSCC** — command/control coordination authority
- **OCP** — policy authorization and approval authority
- **OEG** — execution gateway authority
- **Identity** — operator identity, roles, and session authority
- **Registry** — canonical record and registration authority
- **Audit** — immutable event and evidence authority

ACC must not self-authorize agents, mint identity, write registry truth, or replace audit systems.

## Repository separation

Do not merge ACC into any of these repositories or surfaces:

- QRV
- OneGodian App
- Capital
- OMOS
- WordPress plugin repositories

This repository contains only ACC-related screens, components, routes, styles, configs, documentation, and deploy metadata.

## Routes

- `/` — ACC overview and authority boundary
- `/dashboard` — operator dashboard
- `/agents` — agent registry/readiness surface
- `/tasks` — task queue surface
- `/workflows` — workflow visibility surface
- `/ocp` — OCP decision viewer boundary
- `/oeg` — OEG route viewer boundary
- `/adapters` — adapter readiness
- `/approvals` — approval queue
- `/audit` — audit viewer boundary
- `/deployments` — deployment readiness
- `/status` — operational status
- `/docs` — repository doctrine

## API routes

Public/noindex status routes:

- `/api/health`
- `/api/manifest`
- `/api/readiness`
- `/api/version`

Operator API read-model routes:

- `/api/agents`
- `/api/tasks`
- `/api/workflows`
- `/api/audit`

## Local development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run typecheck
npm run lint
npm run build
```

## Deployment

Deploy the `main` branch of `ohi-stack/acc` to:

```text
https://acc.onegodian.com
```

The app ships noindex headers and `robots.txt` disallow rules because it is operator-facing only.

## OneGodian Members v2.1.0 package artifact

Generate the WordPress production-candidate package with:

```bash
scripts/package-onegodian-members.sh
```

The generated ZIP is written to:

```text
dist/onegodian-members-v2.1.0-platform-services-edition.zip
```

The ZIP is intentionally ignored by Git so pushes do not include generated binary artifacts. The build source lives in `wordpress-plugins/onegodian-members-v2.1.0-platform-services-edition/` and consolidates the requested OneGodian Members functionality into v2.1.0 Platform Services Edition, including tabbed admin UI, BuddyPress/community hooks, auto pages, certificates/PDFs/digital IDs, WooCommerce and Stripe boundaries, app bridge, protected content, REST endpoints, and platform service boundaries for LMS, Belief Mapper, Media, Galaxy, Registry, Certificate, Dashboard, Auth, and RBAC.

The package README contains the requested feature inventory for the historical source packages, and the production checklist captures packaging and runtime validation status.

## ONEGODIAN Capital production architecture notes

This app now exposes public routing and positioning for the ONEGODIAN Capital product lines while keeping QRV Network as the infrastructure layer:

- `/zolfi` presents Zolfi as ONEGODIAN Capital’s blockchain security, smart contract intelligence, and post-quantum readiness product line. Source reference: `ohi-stack/zolfi-platform`.
- `/instryx` presents INSTRYX as ONEGODIAN Capital’s infrastructure intelligence, investment readiness, financial workflow, and execution analytics product line. Source reference: `ohi-stack/instryx-financial-interface`.
- `/verify` and `/registry` point verification and proof workflows to QRV Network.

Infrastructure mapping:

- `capital.onegodian.com/zolfi` — public Zolfi page
- `capital.onegodian.com/instryx` — public INSTRYX page
- `api.zolfi.qrv.network` — Zolfi API/backend
- `dev.zolfi.qrv.network` — Zolfi developer docs
- `status.zolfi.qrv.network` — Zolfi monitoring
- `verify.qrv.network` — verification
- `registry.qrv.network` — registry/proof layer

Release checklist:

- Confirm navigation, footer, metadata, CTAs, disclosure references, verification references, product cards, sitemap data, and manifest data are aligned.
- Run `npm install`, `npm run lint`, and `npm run build` before deployment.
