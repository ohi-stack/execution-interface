# Branch Protection Enforcement for `main`

This repository should enforce the following protections on the `main` branch:

1. **Require all status checks to pass before merge**
   - Required check names:
     - `node-checks`
     - `php-lint-bridge`
2. **Require at least 1 approving review**
3. **Disallow direct pushes to `main`**

## GitHub UI steps

1. Go to **Settings → Branches → Add branch protection rule**.
2. Branch name pattern: `main`.
3. Enable:
   - *Require a pull request before merging*
   - *Require approvals* = `1`
   - *Require status checks to pass before merging*
   - Select `node-checks` and `php-lint-bridge`
   - *Do not allow bypassing the above settings*
   - *Restrict who can push to matching branches* (leave empty or assign release bots only)

## GitHub CLI alternative

If you manage repository rules by CLI/API, apply an equivalent ruleset with:

```bash
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  /repos/<owner>/<repo>/branches/main/protection \
  -f required_status_checks.strict=true \
  -f required_pull_request_reviews.required_approving_review_count=1 \
  -f enforce_admins=true \
  -F required_status_checks.contexts[]='node-checks' \
  -F required_status_checks.contexts[]='php-lint-bridge' \
  -f restrictions='null'
```

> Note: exact API payload fields can vary by organization policy and whether classic branch protection or repository rulesets are in use.
