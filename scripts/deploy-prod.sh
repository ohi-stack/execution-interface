#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-$(pwd)}"
BRANCH="${BRANCH:-main}"
PM2_APP_NAME="${PM2_APP_NAME:-onegodian-app}"
RESTART_MODE="${RESTART_MODE:-pm2}"
VERIFY_BASE_URL="${VERIFY_BASE_URL:-https://app.onegodian.com}"

ROUTES=(
  "/galaxy"
  "/galaxy/planets"
  "/systems"
  "/games"
  "/capital"
  "/members"
  "/algorithm"
)

echo "[deploy] app dir: $APP_DIR"
cd "$APP_DIR"

echo "[deploy] fetching latest from origin/$BRANCH"
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

echo "[deploy] removing stale build output"
rm -rf .next

echo "[deploy] installing dependencies"
npm install

echo "[deploy] building application"
npm run build

case "$RESTART_MODE" in
  pm2)
    echo "[deploy] restarting PM2 app: $PM2_APP_NAME"
    pm2 restart "$PM2_APP_NAME"
    pm2 save
    ;;
  node)
    echo "[deploy] restart mode set to 'node'."
    echo "[deploy] stop current node process manually if needed, then run: npm run start"
    ;;
  none)
    echo "[deploy] restart skipped (RESTART_MODE=none)"
    ;;
  *)
    echo "[deploy] unknown RESTART_MODE: $RESTART_MODE"
    exit 1
    ;;
esac

echo "[verify] checking production routes at $VERIFY_BASE_URL"
failed=0
for route in "${ROUTES[@]}"; do
  code="$(curl -s -o /dev/null -w "%{http_code}" "$VERIFY_BASE_URL$route")"
  echo "$code $route"
  if [[ "$code" != "200" ]]; then
    failed=1
  fi
done

if [[ "$failed" -ne 0 ]]; then
  echo "[verify] one or more routes did not return 200"
  exit 2
fi

echo "[verify] all required routes returned 200"
