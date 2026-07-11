#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLUGIN_DIR="${ROOT_DIR}/wordpress-plugins/onegodian-members-v2.1.0-platform-services-edition"
DIST_DIR="${ROOT_DIR}/dist"
ZIP_PATH="${DIST_DIR}/onegodian-members-v2.1.0-platform-services-edition.zip"

if [[ ! -d "${PLUGIN_DIR}" ]]; then
  echo "Plugin source directory not found: ${PLUGIN_DIR}" >&2
  exit 1
fi

mkdir -p "${DIST_DIR}"
rm -f "${ZIP_PATH}"

(
  cd "${ROOT_DIR}/wordpress-plugins"
  zip -r "${ZIP_PATH}" onegodian-members-v2.1.0-platform-services-edition \
    -x '*/node_modules/*' '*/.git/*' '*/.DS_Store'
)

echo "Generated ${ZIP_PATH}"
