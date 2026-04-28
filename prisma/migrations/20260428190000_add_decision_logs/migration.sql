CREATE TABLE IF NOT EXISTS decision_logs (
  decision_id UUID PRIMARY KEY,
  execution_id TEXT NULL,
  workflow_id TEXT NULL,
  tenant_id TEXT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  agent_id TEXT NULL,
  role TEXT NOT NULL,
  action TEXT NOT NULL,
  resource TEXT NULL,
  environment TEXT NOT NULL,
  authority_scope JSONB NOT NULL,
  policy_id TEXT NULL,
  policy_hash TEXT NULL,
  input_hash TEXT NULL,
  output_hash TEXT NULL,
  risk_level TEXT NOT NULL,
  decision TEXT NOT NULL,
  reason TEXT NOT NULL,
  approval_status TEXT NOT NULL,
  approval_level TEXT NULL,
  request_id TEXT NOT NULL,
  timestamp_utc TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS decision_logs_created_at_idx ON decision_logs (created_at DESC);

CREATE TABLE IF NOT EXISTS kill_switch_state (
  scope_type TEXT NOT NULL,
  scope_id TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  reason TEXT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (scope_type, scope_id)
);
