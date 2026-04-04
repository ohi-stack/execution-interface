#!/usr/bin/env bash

set -euo pipefail

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]] && kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    echo ""
    echo "🧹 Shutting down server..."
    kill "$SERVER_PID" >/dev/null 2>&1 || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

echo ""
echo "========================================"
echo "QR-V SYSTEM ACTIVATION (ENFORCED MODE)"
echo "========================================"
echo ""

API_BASE=${API_BASE:-http://localhost:3000}
VERIFY_BASE=${VERIFY_BASE:-https://verify.qrv.network}
PORT=${PORT:-3000}

export API_BASE VERIFY_BASE PORT

echo "🔍 Checking environment..."
command -v node >/dev/null || { echo "❌ Node not installed"; exit 1; }
command -v npm >/dev/null || { echo "❌ npm not installed"; exit 1; }
command -v curl >/dev/null || { echo "❌ curl not installed"; exit 1; }

echo "✅ Node + npm + curl OK"

if [ ! -d "node_modules" ]; then
  echo ""
  echo "📦 Installing dependencies..."
  npm install
fi

echo ""
echo "🛡 Running enforcement validation..."
npm run validate:enforcement
echo "✅ Enforcement layer VALID"

echo ""
echo "🧪 Running test suite..."
npm test
echo "✅ Tests PASS"

echo ""
echo "🚀 Starting API server..."
node server.js &
SERVER_PID=$!

sleep 2

echo ""
echo "🔎 Checking /health..."
if ! curl -fsS "$API_BASE/health" >/dev/null; then
  echo "❌ API failed health check"
  exit 1
fi

echo "✅ API is healthy"

echo ""
echo "⚡ Running activation loop..."
node scripts/activate-qrv.js

echo ""
echo "========================================"
echo "✅ SYSTEM ACTIVATED SUCCESSFULLY"
echo "========================================"
echo ""
