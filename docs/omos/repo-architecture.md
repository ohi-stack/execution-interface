# ONEGODIAN Repository Architecture

This repository now includes a starter ecosystem aligned to the four-layer OMOS model:

1. **Identity Layer** (`src/services/omos/identityService.js`)
2. **Algorithm Layer** (`src/services/omos/algorithmService.js`)
3. **Protocol Layer** (`src/routes/api/omosRoutes.js`)
4. **Institution Layer** (`alignment/system-prompt.txt` + governance docs)

## Starter repos scaffolded in-tree

- `omos-core/`
- `onegodian-time/`
- `onegodian-agent/`

These directories are deployable seeds that can be split into dedicated repositories.
