import { runMigrations } from '../src/db/migrator.js';
import { closePool } from '../src/db/pool.js';
import { logger } from '../src/config/logger.js';

try {
  const appliedFiles = await runMigrations();
  logger.info('Database migration process complete.', { appliedFiles });
} catch (error) {
  logger.error('Database migration process failed.', { error: error.message });
  process.exitCode = 1;
} finally {
  await closePool();
}
