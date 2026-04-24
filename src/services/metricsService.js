import pg from 'pg';

const { Pool } = pg;

const memoryMetrics = {
  scans_today: 0,
  verify_latency_ms: 0,
  total_records: 0,
  revoked_records: 0,
};

export const setMemoryMetricsSnapshot = (snapshot) => {
  Object.assign(memoryMetrics, snapshot);
};

export const getMetrics = async () => {
  if (!process.env.DATABASE_URL) {
    return { ...memoryMetrics };
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const [scans, latency, totals] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS scans_today FROM qr_audit_log WHERE action IN ('VERIFY','FAILED_VERIFY') AND created_at::date = CURRENT_DATE`),
      pool.query(`SELECT COALESCE(AVG((detail->>'latency_ms')::numeric), 0)::float AS verify_latency_ms FROM qr_audit_log WHERE action IN ('VERIFY','FAILED_VERIFY') AND created_at::date = CURRENT_DATE`),
      pool.query(`SELECT COUNT(*)::int AS total_records, COUNT(*) FILTER (WHERE status='REVOKED')::int AS revoked_records FROM qr_objects`),
    ]);

    return {
      scans_today: scans.rows[0]?.scans_today || 0,
      verify_latency_ms: latency.rows[0]?.verify_latency_ms || 0,
      total_records: totals.rows[0]?.total_records || 0,
      revoked_records: totals.rows[0]?.revoked_records || 0,
    };
  } finally {
    await pool.end();
  }
};
