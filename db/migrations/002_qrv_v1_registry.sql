BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS qr_issuers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issuer_id TEXT NOT NULL UNIQUE,
  issuer_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qr_objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qrvid TEXT NOT NULL UNIQUE,
  object_type TEXT NOT NULL DEFAULT 'CERTIFICATE',
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  hash TEXT NOT NULL,
  signature TEXT NOT NULL,
  issuer_id UUID NOT NULL REFERENCES qr_issuers(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS qr_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_object_id UUID NOT NULL UNIQUE REFERENCES qr_objects(id) ON DELETE CASCADE,
  recipient TEXT NOT NULL,
  record_type TEXT NOT NULL DEFAULT 'CERTIFICATE',
  certificate_title TEXT NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS qr_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qrvid TEXT NULL,
  issuer_id TEXT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  event_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qr_objects_qrvid ON qr_objects (qrvid);
CREATE INDEX IF NOT EXISTS idx_qr_certificates_status ON qr_certificates (status);
CREATE INDEX IF NOT EXISTS idx_qr_audit_log_qrvid ON qr_audit_log (qrvid);

COMMIT;
