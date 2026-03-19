import dotenv from 'dotenv';
import { closePool, isDatabaseConfigured } from '../services/databaseService.js';
import { initializeRegistrySchema } from '../services/registryService.js';

dotenv.config();

try {
  if (!isDatabaseConfigured()) {
    throw new Error('DATABASE_URL is not configured.');
  }

  await initializeRegistrySchema();
  console.log('Database schema is ready.');
} catch (error) {
  console.error('Failed to initialize database schema:', error);
  process.exitCode = 1;
} finally {
  await closePool();
}
