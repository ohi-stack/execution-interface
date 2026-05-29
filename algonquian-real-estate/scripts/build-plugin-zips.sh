#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
mkdir -p "$DIST_DIR"

for plugin_dir in "$ROOT_DIR"/plugins/*; do
  [ -d "$plugin_dir" ] || continue
  plugin_name="$(basename "$plugin_dir")"
  (cd "$ROOT_DIR/plugins" && zip -qr "$DIST_DIR/$plugin_name.zip" "$plugin_name" -x '*/node_modules/*' '*/vendor/*' '*/.git/*')
  echo "Built $DIST_DIR/$plugin_name.zip"
done
