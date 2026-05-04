CREATE TABLE IF NOT EXISTS scheduler_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'standard',
  status TEXT NOT NULL DEFAULT 'scheduled',

  timestamp_utc TIMESTAMPTZ NOT NULL,
  timestamp_local TEXT NOT NULL,
  timezone TEXT NOT NULL,

  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price_usd NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'not_required',

  created_at_utc TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at_utc TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_events_time
ON scheduler_events(timestamp_utc);
