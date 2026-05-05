const { Pool } = require('pg');
const { ENV } = require('../config/env');

let pool;

if (ENV.ENABLE_DATABASE) {
  pool = new Pool({
    connectionString: ENV.DATABASE_URL,
    ssl: ENV.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
}

async function query(text, params) {
  if (!pool) throw new Error('database_not_enabled');
  return pool.query(text, params);
}

async function checkDatabase() {
  if (!pool) return { enabled: false };

  try {
    await pool.query('SELECT 1');
    return { enabled: true, ok: true };
  } catch (_err) {
    return { enabled: true, ok: false };
  }
}

module.exports = { query, checkDatabase };
