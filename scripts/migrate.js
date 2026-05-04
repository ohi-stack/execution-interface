require('dotenv/config');
const fs = require('fs');
const path = require('path');
const { query } = require('../src/db/postgres');
const { ENV } = require('../src/config/env');
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

(async () => {
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsPath, file), 'utf8');
    console.log(`Running: ${file}`);
    await query(sql);
  }

  console.log('Migrations complete');
  process.exit(0);
})();
for (const file of files) {
  const sql = fs.readFileSync(path.join(migrationsPath, file), 'utf8');
  console.log(`Running: ${file}`);
  await query(sql);
}

console.log('Migrations complete');
process.exit(0);
