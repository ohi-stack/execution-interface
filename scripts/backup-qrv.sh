#!/usr/bin/env bash
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL is required}"
BACKUP_DIR="${QRV_BACKUP_DIR:-artifacts/backups}"
mkdir -p "$BACKUP_DIR"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT_FILE="$BACKUP_DIR/qrv-registry-$STAMP.sql.gz"

pg_dump "$DATABASE_URL" | gzip > "$OUT_FILE"
echo "QRV backup created: $OUT_FILE"
