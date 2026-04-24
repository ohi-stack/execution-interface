-- QRV production launch hardening
-- Adds operational indexes and issuer seed records.

CREATE INDEX IF NOT EXISTS idx_qrv_records_status ON qrv_records (status);
CREATE INDEX IF NOT EXISTS idx_qrv_records_issuer_status ON qrv_records (issuer, status);
CREATE INDEX IF NOT EXISTS idx_qrv_audit_actor_occurred ON qrv_audit_events (actor, occurred_at_utc DESC);

CREATE TABLE IF NOT EXISTS qrv_issuers (
  issuer_id TEXT PRIMARY KEY,
  issuer_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED')),
  created_at_utc TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at_utc TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO qrv_issuers (issuer_id, issuer_name, status)
VALUES
  ('issuer-qrv-prod-001', 'QRV Demo University', 'ACTIVE'),
  ('issuer-qrv-prod-002', 'QRV Workforce Board', 'ACTIVE'),
  ('issuer-qrv-prod-003', 'QRV Professional Council', 'ACTIVE')
ON CONFLICT (issuer_id) DO UPDATE SET
  issuer_name = EXCLUDED.issuer_name,
  status = EXCLUDED.status,
  updated_at_utc = NOW();
