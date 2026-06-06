#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLUGIN_DIR="$ROOT_DIR/onegodian-capital-plugin"
PLUGIN_NAME="onegodian-capital-plugin"
VERSION="0.3.1"
ZIP_NAME="${PLUGIN_NAME}-v${VERSION}-product-sync.zip"
ZIP_PATH="$ROOT_DIR/$ZIP_NAME"

if [ ! -d "$PLUGIN_DIR" ]; then
  echo "ERROR: missing plugin directory: $PLUGIN_DIR" >&2
  exit 1
fi

echo "== PHP syntax check =="
find "$PLUGIN_DIR" -name "*.php" -print0 | xargs -0 -n1 php -l

echo "== Build ZIP =="
rm -f "$ZIP_PATH"
(cd "$ROOT_DIR" && zip -qr "$ZIP_NAME" "$PLUGIN_NAME" -x '*/node_modules/*' '*/vendor/*' '*/.git/*')

echo "Built $ZIP_PATH"
