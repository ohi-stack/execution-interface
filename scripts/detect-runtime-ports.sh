#!/usr/bin/env bash
set -euo pipefail

echo "[1/2] Detected configured/default runtime ports"
echo "- qrv-registry: ${QRV_REGISTRY_PORT:-4101}"
echo "- qrv-api: ${QRV_API_PORT:-4102}"
echo "- issuer-qrv: ${ISSUER_QRV_PORT:-4103}"

echo
echo "[2/2] Active listeners (if running)"
if command -v ss >/dev/null 2>&1; then
  ss -ltnp | awk 'NR==1 || /:4101|:4102|:4103|:4104|:4105/'
elif command -v netstat >/dev/null 2>&1; then
  netstat -ltnp 2>/dev/null | awk 'NR==1 || /:4101|:4102|:4103|:4104|:4105/'
else
  echo "Neither ss nor netstat is installed; skipping active listener scan."
fi
