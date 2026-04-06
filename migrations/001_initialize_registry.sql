CREATE TABLE IF NOT EXISTS qr_objects (
  id TEXT PRIMARY KEY,
  asset_name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  description TEXT NOT NULL,
  subject TEXT,
  record_type TEXT NOT NULL DEFAULT 'REGISTRY_RECORD',
  status TEXT NOT NULL DEFAULT 'VALID',
  hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qr_certificates (
  id SERIAL PRIMARY KEY,
  object_id TEXT NOT NULL REFERENCES qr_objects(id) ON DELETE CASCADE,
  certificate_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qr_audit_log (
  id BIGSERIAL PRIMARY KEY,
  object_id TEXT REFERENCES qr_objects(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
