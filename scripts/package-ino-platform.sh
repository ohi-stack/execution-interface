#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLUGIN_DIR="${ROOT_DIR}/wordpress-plugins/ino-platform"
DIST_DIR="${ROOT_DIR}/dist"
ZIP_PATH="${DIST_DIR}/ino-platform-v0.1.0.zip"
[[ -d "${PLUGIN_DIR}" ]] || { echo "Plugin source directory not found: ${PLUGIN_DIR}" >&2; exit 1; }
mkdir -p "${DIST_DIR}"
rm -f "${ZIP_PATH}"
( cd "${ROOT_DIR}/wordpress-plugins" && zip -r "${ZIP_PATH}" ino-platform -x '*/node_modules/*' '*/.git/*' '*/.DS_Store' )
echo "Generated ${ZIP_PATH}"
