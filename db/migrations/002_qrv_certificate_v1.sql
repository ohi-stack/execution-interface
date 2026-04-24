BEGIN;

CREATE TABLE IF NOT EXISTS qr_issuers (
  id BIGSERIAL PRIMARY KEY,
  issuer_id TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  api_key_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DISABLED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qr_objects (
  id BIGSERIAL PRIMARY KEY,
  qrvid TEXT NOT NULL UNIQUE,
  issuer_id TEXT NOT NULL REFERENCES qr_issuers (issuer_id),
  record_type TEXT NOT NULL DEFAULT 'certificate' CHECK (record_type IN ('certificate')),
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'VERIFIED' CHECK (status IN ('VERIFIED', 'REVOKED', 'EXPIRED')),
  hash TEXT NOT NULL,
  signature TEXT NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NULL,
  revoked_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT qr_object_revoke_consistency CHECK (
    (status = 'REVOKED' AND revoked_at IS NOT NULL) OR
    (status <> 'REVOKED' AND revoked_at IS NULL)
  )
);

CREATE TABLE IF NOT EXISTS qr_certificates (
  id BIGSERIAL PRIMARY KEY,
  qrvid TEXT NOT NULL UNIQUE REFERENCES qr_objects (qrvid) ON DELETE CASCADE,
  recipient TEXT NOT NULL,
  metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qr_audit_log (
  id BIGSERIAL PRIMARY KEY,
  qrvid TEXT NULL,
  issuer_id TEXT NULL,
  action TEXT NOT NULL,
  action_status TEXT NOT NULL CHECK (action_status IN ('SUCCESS', 'DENIED', 'ERROR')),
  detail JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qr_objects_qrvid ON qr_objects (qrvid);
CREATE INDEX IF NOT EXISTS idx_qr_objects_issuer ON qr_objects (issuer_id);
CREATE INDEX IF NOT EXISTS idx_qr_objects_status ON qr_objects (status);
CREATE INDEX IF NOT EXISTS idx_qr_objects_expires_at ON qr_objects (expires_at);
CREATE INDEX IF NOT EXISTS idx_qr_certificates_recipient ON qr_certificates (recipient);
CREATE INDEX IF NOT EXISTS idx_qr_audit_log_qrvid ON qr_audit_log (qrvid);
CREATE INDEX IF NOT EXISTS idx_qr_audit_log_issuer ON qr_audit_log (issuer_id);
CREATE INDEX IF NOT EXISTS idx_qr_audit_log_action ON qr_audit_log (action);

COMMIT;
