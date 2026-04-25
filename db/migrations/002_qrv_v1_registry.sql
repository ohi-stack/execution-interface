-- QRV Certificate Verification System v1 canonical production migration.

ALTER TABLE qrv_records
  ADD COLUMN IF NOT EXISTS signature TEXT,
  ADD COLUMN IF NOT EXISTS revocation_reason TEXT,
  ADD COLUMN IF NOT EXISTS certificate_title TEXT,
  ADD COLUMN IF NOT EXISTS issuer_logo_url TEXT,
  ADD COLUMN IF NOT EXISTS proof_reference TEXT;

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

CREATE TABLE IF NOT EXISTS qrv_api_keys (
  key_id TEXT PRIMARY KEY,
  issuer_id TEXT NOT NULL REFERENCES qrv_issuers(issuer_id),
  key_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REVOKED')),
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

INSERT INTO qrv_records (
  qrvid, issuer, subject, certificate_title, issuer_logo_url, proof_reference, issued_at_utc, expires_at_utc, status, metadata_hash, signature
)
VALUES (
  'QRV-PROD-CERT-000001',
  'issuer-qrv-prod-001',
  'pilot-subject-000001',
  'QRV Pilot Certificate',
  'https://issuer.qrv.network/logo.png',
  'proof:qrv:prod:000001',
  '2026-04-24T00:00:00Z',
  '2027-04-24T00:00:00Z',
  'ACTIVE',
  'd9cb6d02dcf5d9b307fce3f19d2ec8c0d76b4ca6f5f35f579f42fd1f91f22d3b',
  'f72955de24cb611c13f842f2ef95f214ddd6f435f8ff7b9d3e52c3f2e23236d8'
)
ON CONFLICT (qrvid) DO NOTHING;
