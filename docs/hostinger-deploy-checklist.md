# Hostinger deployment checklist (app.onegodian.com)

Use this checklist when promoting the latest `main` build to production.

## 1) Prepare environment

- SSH into the Hostinger/VPS machine.
- Open the project directory containing this repo.
- Confirm required environment variables are set (for example `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and OMOS bridge values).

## 2) Deploy latest code

```bash
git fetch origin
git checkout main
git pull origin main
rm -rf .next
npm install
npm run build
```

## 3) Restart runtime

### PM2 runtime

```bash
pm2 restart onegodian-app
pm2 save
```

### Node runtime (no process manager)

```bash
# stop old process first
npm run start
```

## 4) Verify live routes

```bash
for p in /galaxy /galaxy/planets /systems /games /capital /members /algorithm; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://app.onegodian.com$p")
  echo "$code $p"
done
```

All routes above should return `200`.

## 5) Optional one-command deployment

You can use the helper script in this repo:

```bash
./scripts/deploy-prod.sh
```

Environment overrides:

- `APP_DIR` (defaults to current directory)
- `BRANCH` (defaults to `main`)
- `PM2_APP_NAME` (defaults to `onegodian-app`)
- `RESTART_MODE` (`pm2` | `node` | `none`)
- `VERIFY_BASE_URL` (defaults to `https://app.onegodian.com`)
