# GitHub Conflict Resolution (QR-V Launch Branch)

If GitHub reports conflicts for the launch candidate PR (e.g. files shown in the screenshot), use:

```bash
./scripts/resolve-github-conflicts.sh main
npm run -s lint
npm run -s test:root
npm run -s check
git commit -m "chore: resolve main merge conflicts for QR-V launch branch"
```

## Strategy used

- Keeps launch-branch implementation (`--ours`) for QR-V runtime files.
- Rebuilds `package-lock.json` after merge.
- Uses safe default (`--ours`) for any additional unresolved files.

## Why this is safe for this PR

The launch branch contains the latest QR-V production hardening (Postgres persistence, issuer/admin APIs, metrics, env checks). The script preserves those changes while making merge state clean.
