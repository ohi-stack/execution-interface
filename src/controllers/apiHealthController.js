import { isDatabaseConfigured, testDatabaseConnection } from '../services/databaseService.js';

export const apiHealthHandler = async (_req, res, next) => {
  try {
    if (!isDatabaseConfigured()) {
      return res.status(503).json({
        ok: false,
        service: 'qrv-registry',
        database: 'unconfigured',
        reason: 'DATABASE_URL is not configured.',
      });
    }

    const result = await testDatabaseConnection();

    return res.status(200).json({
      ok: true,
      service: 'qrv-registry',
      database: 'connected',
      time: result.now instanceof Date ? result.now.toISOString() : result.now,
    });
  } catch (error) {
    return next(error);
  }
};

export const databaseProbeHandler = async (_req, res, next) => {
  try {
    const result = await testDatabaseConnection();

    return res.status(200).json({
      time: result.now instanceof Date ? result.now.toISOString() : result.now,
    });
  } catch (error) {
    return next(error);
  }
};
