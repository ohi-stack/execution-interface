import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { query } from '../src/db/postgres.js';
import { ENV } from '../src/config/env.js';

if (!ENV.ENABLE_DATABASE) {
  console.log('Database disabled');
  process.exit(0);
}

if (!ENV.DATABASE_URL) {
  throw new Error('DATABASE_URL required');
}

const migrationsPath = path.resolve('db/migrations');
const files = fs.readdirSync(migrationsPath).sort();

for (const file of files) {
  const sql = fs.readFileSync(path.join(migrationsPath, file), 'utf8');
  console.log(`Running: ${file}`);
  await query(sql);
}

console.log('Migrations complete');
process.exit(0);
