CREATE TABLE IF NOT EXISTS qr_issuers (
  id UUID PRIMARY KEY,
  issuer_name VARCHAR NOT NULL,
  issuer_code VARCHAR UNIQUE,
  issuer_status VARCHAR NOT NULL DEFAULT 'active',
  website_url VARCHAR,
  contact_email VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qr_objects (
  id UUID PRIMARY KEY,
  qrvid VARCHAR NOT NULL UNIQUE,
  record_type VARCHAR NOT NULL,
  object_status VARCHAR NOT NULL DEFAULT 'active',
  issuer_id UUID REFERENCES qr_issuers(id) ON DELETE SET NULL,
  subject_name VARCHAR,
  asset_name VARCHAR,
  description TEXT,
  hash_value VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qr_certificates (
  id UUID PRIMARY KEY,
  qr_object_id UUID NOT NULL REFERENCES qr_objects(id) ON DELETE CASCADE,
  certificate_number VARCHAR,
  issued_to VARCHAR,
  issued_date DATE,
  expiry_date DATE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qr_hash_registry (
  id UUID PRIMARY KEY,
  qr_object_id UUID NOT NULL REFERENCES qr_objects(id) ON DELETE CASCADE,
  hash_algorithm VARCHAR NOT NULL DEFAULT 'SHA-256',
  hash_value VARCHAR NOT NULL,
  hash_status VARCHAR NOT NULL DEFAULT 'valid',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qr_audit_log (
  id UUID PRIMARY KEY,
  qr_object_id UUID REFERENCES qr_objects(id) ON DELETE SET NULL,
  action_type VARCHAR NOT NULL,
  action_actor VARCHAR,
  action_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qr_objects_qrvid ON qr_objects (qrvid);
CREATE INDEX IF NOT EXISTS idx_qr_objects_issuer_id ON qr_objects (issuer_id);
CREATE INDEX IF NOT EXISTS idx_qr_hash_registry_qr_object_id ON qr_hash_registry (qr_object_id);
CREATE INDEX IF NOT EXISTS idx_qr_audit_log_qr_object_id ON qr_audit_log (qr_object_id);
