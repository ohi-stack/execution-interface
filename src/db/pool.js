import { Pool } from 'pg';
import { env, isProduction } from '../config/env.js';
import { logger } from '../config/logger.js';
import { AppError } from '../utils/appError.js';

let pool;

export const getPool = () => {
  if (!env.databaseUrl) {
    throw new AppError(500, 'DATABASE_URL_MISSING', 'DATABASE_URL is not configured.');
  }

  if (!pool) {
    pool = new Pool({
      connectionString: env.databaseUrl,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    });

    pool.on('error', (error) => {
      logger.error('Unexpected PostgreSQL pool error.', { error: error.message });
    });
  }

  return pool;
};

export const query = async (text, params = []) => getPool().query(text, params);

export const withTransaction = async (callback) => {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
};
