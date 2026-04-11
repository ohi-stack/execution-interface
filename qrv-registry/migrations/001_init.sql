BEGIN;

CREATE TABLE IF NOT EXISTS qr_issuers (
  id BIGSERIAL PRIMARY KEY,
  issuer_code TEXT NOT NULL UNIQUE,
  issuer_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qr_objects (
  id BIGSERIAL PRIMARY KEY,
  qrvid TEXT NOT NULL UNIQUE,
  record_type TEXT NOT NULL,
  issuer_id BIGINT NOT NULL REFERENCES qr_issuers(id),
  status TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  signature TEXT NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qr_certificates (
  id BIGSERIAL PRIMARY KEY,
  qr_object_id BIGINT NOT NULL UNIQUE REFERENCES qr_objects(id) ON DELETE CASCADE,
  certificate_title TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  description TEXT,
  metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS qr_audit_log (
  id BIGSERIAL PRIMARY KEY,
  qr_object_id BIGINT NOT NULL REFERENCES qr_objects(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qr_objects_issuer_id ON qr_objects(issuer_id);
CREATE INDEX IF NOT EXISTS idx_qr_objects_status ON qr_objects(status);
CREATE INDEX IF NOT EXISTS idx_qr_audit_log_object ON qr_audit_log(qr_object_id);

COMMIT;
