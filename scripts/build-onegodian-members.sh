#!/usr/bin/env bash
set -euo pipefail

PLUGIN_SLUG="onegodian-members"
PLUGIN_DIR="plugins/${PLUGIN_SLUG}"
OUTPUT_ZIP="onegodian-members-v1.7.1-woocommerce-sync.zip"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -d "$PLUGIN_DIR" ]; then
  echo "ERROR: Plugin directory not found: $PLUGIN_DIR" >&2
  exit 1
fi

if [ ! -f "$PLUGIN_DIR/onegodian-members.php" ]; then
  echo "ERROR: Main plugin file not found: $PLUGIN_DIR/onegodian-members.php" >&2
  exit 1
fi

rm -f "$OUTPUT_ZIP"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

mkdir -p "$TMP_DIR/$PLUGIN_SLUG"
cp -R "$PLUGIN_DIR/." "$TMP_DIR/$PLUGIN_SLUG/"

find "$TMP_DIR/$PLUGIN_SLUG" \
  -name '.git' -o \
  -name '.github' -o \
  -name 'node_modules' -o \
  -name 'vendor' -o \
  -name '.DS_Store' -o \
  -name '*.zip' -o \
  -name '__MACOSX' \
  | while read -r item; do rm -rf "$item"; done

(
  cd "$TMP_DIR"
  zip -rq "$ROOT_DIR/$OUTPUT_ZIP" "$PLUGIN_SLUG"
)

unzip -t "$OUTPUT_ZIP"
echo "Built $OUTPUT_ZIP"
