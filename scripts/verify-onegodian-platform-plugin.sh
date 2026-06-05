#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLUGIN_SLUG="onegodian-platform-plugin"
PLUGIN_DIR="$ROOT_DIR/$PLUGIN_SLUG"
MAIN_FILE="$PLUGIN_DIR/onegodian-platform-plugin.php"
ZIP_PATH="$ROOT_DIR/${PLUGIN_SLUG}-v1.0.0.zip"
VERSION="1.0.0"

fail() {
  echo "Verification failed: $*" >&2
  exit 1
}

pass() {
  echo "✓ $*"
}

contains_text() {
  local file="$1"
  local text="$2"
  grep -Fq "$text" "$file" || fail "Missing '$text' in ${file#$ROOT_DIR/}"
}

[[ -d "$PLUGIN_DIR" ]] || fail "Missing plugin directory: ${PLUGIN_DIR#$ROOT_DIR/}"
pass "Plugin directory exists"

[[ -f "$MAIN_FILE" ]] || fail "Missing main plugin file: ${MAIN_FILE#$ROOT_DIR/}"
pass "Main plugin file exists"

contains_text "$MAIN_FILE" "Version: $VERSION"
contains_text "$MAIN_FILE" "ONEGODIAN_PLATFORM_VERSION', '$VERSION'"
pass "Plugin version is $VERSION"

required_files=(
  "assets/css/onegodian-platform.css"
  "docs/ONEGODIAN_PLATFORM_V1.md"
)
for relative_path in "${required_files[@]}"; do
  [[ -f "$PLUGIN_DIR/$relative_path" ]] || fail "Missing required file: $PLUGIN_SLUG/$relative_path"
  pass "Required file exists: $PLUGIN_SLUG/$relative_path"
done

connector_classes=(
  "class OG_Connector_Admin"
  "class OG_Connector_Registry"
  "class OG_Connectors"
)
for class_name in "${connector_classes[@]}"; do
  rg --type php --fixed-strings --quiet "$class_name" "$PLUGIN_DIR/includes/connectors" || fail "Missing connector class: $class_name"
  pass "Connector class exists: $class_name"
done

pattern_classes=(
  "class OG_Patterns"
)
for class_name in "${pattern_classes[@]}"; do
  rg --type php --fixed-strings --quiet "$class_name" "$PLUGIN_DIR/includes/patterns" || fail "Missing pattern class: $class_name"
  pass "Pattern class exists: $class_name"
done

overlay_classes=(
  "class OG_Navigation_Overlays"
)
for class_name in "${overlay_classes[@]}"; do
  rg --type php --fixed-strings --quiet "$class_name" "$PLUGIN_DIR/includes/navigation-overlays" || fail "Missing navigation overlay class: $class_name"
  pass "Navigation overlay class exists: $class_name"
done

rest_routes=(
  "/health"
  "/manifest"
  "/tools"
  "/stats"
  "/connectors"
  "/connectors/status"
  "/connectors/test"
)
for route in "${rest_routes[@]}"; do
  rg --type php --fixed-strings --quiet "$route" "$PLUGIN_DIR" || fail "Missing REST route string: $route"
  pass "REST route string exists: $route"
done

[[ -f "$ZIP_PATH" ]] || fail "Missing ZIP artifact: ${ZIP_PATH#$ROOT_DIR/}. Run scripts/build-onegodian-platform-plugin.sh first."

mapfile -t top_level_entries < <(zipinfo -1 "$ZIP_PATH" | awk -F/ 'NF > 1 { print $1 "/" } NF == 1 && $1 != "" { print $1 }' | sort -u)
if [[ "${#top_level_entries[@]}" -ne 1 || "${top_level_entries[0]}" != "$PLUGIN_SLUG/" ]]; then
  printf 'ZIP top-level entries found:\n' >&2
  printf ' - %s\n' "${top_level_entries[@]}" >&2
  fail "ZIP must contain exactly one top-level folder: $PLUGIN_SLUG/"
fi
pass "ZIP contains one top-level folder only: $PLUGIN_SLUG/"

unzip -t "$ZIP_PATH" >/dev/null
pass "ZIP integrity check passed"

pass "OneGodian Platform Plugin production verification complete"
