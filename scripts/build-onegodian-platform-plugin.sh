#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLUGIN_DIR="$ROOT_DIR/onegodian-platform-plugin"
ZIP_PATH="$ROOT_DIR/onegodian-platform-plugin-v1.0.0.zip"

if [[ ! -d "$PLUGIN_DIR" ]]; then
  echo "Missing plugin directory: $PLUGIN_DIR" >&2
  exit 1
fi

rm -f "$ZIP_PATH"
cd "$ROOT_DIR"
zip -r "$ZIP_PATH" onegodian-platform-plugin -x '*/.DS_Store' '*.git*'
unzip -t "$ZIP_PATH"
echo "Built $ZIP_PATH"
