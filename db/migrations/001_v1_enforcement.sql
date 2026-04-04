-- V1 QR-V enforcement schema
-- Canonical timestamps are UTC (TIMESTAMPTZ).

CREATE TABLE IF NOT EXISTS qrv_records (
  id BIGSERIAL PRIMARY KEY,
  qrvid TEXT NOT NULL UNIQUE,
  issuer TEXT NOT NULL,
  subject TEXT NOT NULL,
  issued_at_utc TIMESTAMPTZ NOT NULL,
  expires_at_utc TIMESTAMPTZ NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REVOKED')),
  revoked_at_utc TIMESTAMPTZ NULL,
  metadata_hash TEXT NOT NULL,
  created_at_utc TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at_utc TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT qrv_records_revocation_consistency CHECK (
    (status = 'ACTIVE' AND revoked_at_utc IS NULL) OR
    (status = 'REVOKED' AND revoked_at_utc IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_qrv_records_issuer ON qrv_records (issuer);
CREATE INDEX IF NOT EXISTS idx_qrv_records_expires_at_utc ON qrv_records (expires_at_utc);

CREATE TABLE IF NOT EXISTS qrv_audit_events (
  event_id UUID PRIMARY KEY,
  event_type TEXT NOT NULL,
  actor TEXT NOT NULL,
  target_qrvid TEXT NULL,
  occurred_at_utc TIMESTAMPTZ NOT NULL,
  recorded_at_utc TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  decision TEXT NOT NULL CHECK (decision IN ('allow', 'deny', 'escalate')),
  reason TEXT NOT NULL,
  obligations JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_qrv_audit_target ON qrv_audit_events (target_qrvid);
CREATE INDEX IF NOT EXISTS idx_qrv_audit_occurred ON qrv_audit_events (occurred_at_utc);
