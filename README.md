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
