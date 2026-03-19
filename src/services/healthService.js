import { query } from '../db/pool.js';

export const getHealthStatus = async () => {
  const result = await query('SELECT NOW() AS database_time');
  return {
    status: 'ok',
    service: 'qrv-registry',
    database: 'ok',
    timestamp: new Date().toISOString(),
    databaseTime: result.rows[0].database_time instanceof Date
      ? result.rows[0].database_time.toISOString()
      : result.rows[0].database_time,
  };
};
