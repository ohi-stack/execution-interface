import { Pool } from 'pg';

const DEFAULT_DATABASE_SSL_REJECT_UNAUTHORIZED = false;
const SSL_QUERY_PARAMS = [
  'sslmode',
  'sslcert',
  'sslkey',
  'sslrootcert',
  'sslca',
  'sslcrl',
];

let pool;
let sanitizedDatabaseUrl;

const getRawDatabaseUrl = () => process.env.DATABASE_URL || process.env.POSTGRES_URL || '';

const shouldUseSsl = () => {
  const value = process.env.DATABASE_SSL_ENABLED;

  if (typeof value === 'string') {
    return value.toLowerCase() !== 'false';
  }

  return true;
};

const shouldRejectUnauthorized = () => {
  const value = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED;

  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }

  return DEFAULT_DATABASE_SSL_REJECT_UNAUTHORIZED;
};

const sanitizeConnectionString = (connectionString) => {
  if (!connectionString) {
    return '';
  }

  const url = new URL(connectionString);
  let removedSslParameters = false;

  for (const key of SSL_QUERY_PARAMS) {
    if (url.searchParams.has(key)) {
      removedSslParameters = true;
      url.searchParams.delete(key);
    }
  }

  if (removedSslParameters) {
    console.warn('Removed SSL query parameters from DATABASE_URL so explicit pool SSL settings can be applied.');
  }

  return url.toString();
};

export const getDatabaseUrl = () => {
  if (!sanitizedDatabaseUrl) {
    sanitizedDatabaseUrl = sanitizeConnectionString(getRawDatabaseUrl());
  }

  return sanitizedDatabaseUrl;
};

export const isDatabaseConfigured = () => Boolean(getDatabaseUrl());

export const getPool = () => {
  if (!isDatabaseConfigured()) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: getDatabaseUrl(),
      ssl: shouldUseSsl()
        ? {
            rejectUnauthorized: shouldRejectUnauthorized(),
          }
        : false,
    });

    pool.on('error', (error) => {
      console.error('Unexpected Postgres pool error:', error);
    });
  }

  return pool;
};

export const query = async (text, params = []) => {
  const dbPool = getPool();

  if (!dbPool) {
    const error = new Error('DATABASE_URL is not configured.');
    error.code = 'DB_NOT_CONFIGURED';
    throw error;
  }

  return dbPool.query(text, params);
};

export const testDatabaseConnection = async () => {
  const result = await query('SELECT NOW() AS now');
  return result.rows[0];
};

export const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
};
