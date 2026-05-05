#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-${BASE_URL:-https://app.onegodian.com}}"
WP_BASE_URL="${2:-${WP_BASE_URL:-https://onegodian.org}}"

ROUTES=(
  "/dashboard"
  "/ecosystem"
  "/galaxy"
  "/galaxy/planets"
  "/systems"
  "/members"
  "/algorithm"
  "/learn"
  "/capital"
  "/games"
  "/belief-mapper"
  "/institutional"
)

HEALTH_ROUTES=(
  "/health"
  "/ready"
  "/version"
)

MEMBERS_ROUTES=(
  "/wp-json/onegodian-members/v1/health"
  "/wp-json/onegodian-members/v1/manifest"
  "/wp-json/onegodian-members/v1/me"
  "/wp-json/onegodian-members/v1/admin/summary"
)

APP_BRIDGE_ROUTES=(
  "/api/members/health"
  "/api/members/manifest"
)

check_route() {
  local base="$1"
  local route="$2"
  local expected_regex="${3:-^200$}"

  local code
  code=$(curl -sS -o /dev/null -w "%{http_code}" "$base$route" || true)

  if [[ "$code" =~ $expected_regex ]]; then
    printf "✅ %s%s -> %s\n" "$base" "$route" "$code"
  else
    printf "❌ %s%s -> %s\n" "$base" "$route" "$code"
    return 1
  fi
}

echo "Checking app routes at: $BASE_URL"
for route in "${ROUTES[@]}"; do
  check_route "$BASE_URL" "$route"
done

echo "Checking health endpoints at: $BASE_URL"
for route in "${HEALTH_ROUTES[@]}"; do
  check_route "$BASE_URL" "$route"
done

echo "Checking app bridge endpoints at: $BASE_URL"
for route in "${APP_BRIDGE_ROUTES[@]}"; do
  check_route "$BASE_URL" "$route" '^(200|401|403)$'
done

echo "Checking WordPress members endpoints at: $WP_BASE_URL"
for route in "${MEMBERS_ROUTES[@]}"; do
  check_route "$WP_BASE_URL" "$route" '^(200|401|403)$'
done

echo "All checks complete."
