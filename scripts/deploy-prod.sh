#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-$(pwd)}"
BRANCH="${BRANCH:-main}"
REPO_URL="${REPO_URL:-https://github.com/ohi-stack/onegodian-app-deploy.git}"
RESTART_MODE="${RESTART_MODE:-none}" # none | pm2 | node
PM2_APP_NAME="${PM2_APP_NAME:-onegodian-app}"
VERIFY_BASE_URL="${VERIFY_BASE_URL:-https://app.onegodian.com}"

echo "== OneGodian Hostinger Deploy =="
echo "APP_DIR=$APP_DIR"
echo "BRANCH=$BRANCH"
echo "RESTART_MODE=$RESTART_MODE"
echo "VERIFY_BASE_URL=$VERIFY_BASE_URL"

cd "$APP_DIR"

echo "== Git remote check =="
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if git remote get-url origin >/dev/null 2>&1; then
    ORIGIN_URL="$(git remote get-url origin)"
    echo "origin exists: $ORIGIN_URL"

    case "$ORIGIN_URL" in
      *ohi-stack/execution-interface.git|*ohi-stack/execution-interface)
        echo "origin points at legacy execution-interface repo; updating origin to production deploy repo: $REPO_URL"
        git remote set-url origin "$REPO_URL"
        ;;
    esac
  else
    echo "origin missing; adding origin: $REPO_URL"
    git remote add origin "$REPO_URL"
  fi

  echo "Fetching latest $BRANCH..."
  git fetch origin "$BRANCH" || echo "WARNING: git fetch failed; continuing with local checkout."

  if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
    git checkout "$BRANCH"
  else
    git checkout -B "$BRANCH" "origin/$BRANCH" || echo "WARNING: could not checkout origin/$BRANCH."
  fi

  git pull origin "$BRANCH" || echo "WARNING: git pull failed; continuing with local files."
else
  echo "WARNING: not inside a git repository; skipping git sync."
fi

echo "== Node/npm check =="
node -v
npm -v

echo "== Clean install =="
rm -rf node_modules .next
if [ -f package-lock.json ]; then
  npm ci --include=dev || npm install --include=dev
else
  npm install --include=dev
fi

echo "== Validation =="
npm run lint
npm run typecheck
npm run build

echo "== Server syntax check =="
node --check server.js || echo "WARNING: server.js syntax check failed or unavailable."

echo "== Restart =="
case "$RESTART_MODE" in
  pm2)
    if command -v pm2 >/dev/null 2>&1; then
      pm2 restart "$PM2_APP_NAME" || pm2 start server.js --name "$PM2_APP_NAME"
      pm2 save || true
    else
      echo "WARNING: PM2 not installed. Restart manually in Hostinger."
    fi
    ;;
  node)
    echo "Starting node server.js in background..."
    nohup node server.js > onegodian-app.log 2>&1 &
    ;;
  none)
    echo "Skipping runtime restart. Restart the app manually in Hostinger Node panel."
    ;;
  *)
    echo "Unknown RESTART_MODE=$RESTART_MODE"
    exit 1
    ;;
esac

echo "== Route verification =="
ROUTES=(
  /
  /dashboard
  /ecosystem
  /galaxy
  /galaxy/planets
  /galaxy/moons-systems
  /systems
  /registry
  /games
  /games/bingo
  /capital
  /certificates
  /products
  /media
  /learn
  /algorithm
  /belief-mapper
  /standards/visual-covers
  /institutional
  /developers
  /members
  /profile
  /id-card
  /omos
)

FAILED=0

for route in "${ROUTES[@]}"; do
  code=$(curl -L -s -o /tmp/onegodian-route-check.html -w "%{http_code}" "$VERIFY_BASE_URL$route" || echo "000")
  echo "$code $route"

  if [[ "$code" != "200" && "$code" != "301" && "$code" != "302" && "$code" != "307" && "$code" != "308" ]]; then
    FAILED=1
  fi
done

if [ "$FAILED" -eq 1 ]; then
  echo "WARNING: One or more route checks failed. Build succeeded, but live deployment parity is incomplete."
  exit 2
fi

echo "== Production deploy complete =="
echo "Latest build deployed/validated for $VERIFY_BASE_URL"
