import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateRecordId } from '../utils/recordId.js';
import { query } from './databaseService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationFile = path.resolve(__dirname, '../../migrations/001_initialize_registry.sql');

let schemaInitialized = false;
let createTableStatementsPromise;

const mapRowToRecord = (row) => {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    issuer: row.issuer,
    description: row.description,
    subject: row.subject,
    recordType: row.record_type,
    status: row.status,
    hash: row.hash,
    timestamp: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  };
};

const getCreateTableStatements = async () => {
  if (!createTableStatementsPromise) {
    createTableStatementsPromise = fs.readFile(migrationFile, 'utf8').then((sql) => sql
      .split(/;\s*(?:\n|$)/)
      .map((statement) => statement.trim())
      .filter(Boolean));
  }

  return createTableStatementsPromise;
};

export const initializeRegistrySchema = async () => {
  if (schemaInitialized) {
    return;
  }

  const statements = await getCreateTableStatements();

  for (const statement of statements) {
    await query(statement);
  }

  schemaInitialized = true;
};

export const createRecord = async ({ assetName, issuer, description, subject = null, recordType = 'REGISTRY_RECORD' }) => {
  await initializeRegistrySchema();

  const id = generateRecordId();
  const hash = generateRecordId().replace('QRV-', 'sha256:');
  const result = await query(
    `INSERT INTO qr_objects (id, asset_name, issuer, description, subject, record_type, status, hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, issuer, description, subject, record_type, status, hash, created_at`,
    [id, assetName, issuer, description, subject, recordType, 'VALID', hash],
  );

  await query(
    `INSERT INTO qr_audit_log (object_id, event_type, event_payload)
     VALUES ($1, $2, $3::jsonb)`,
    [id, 'record_created', JSON.stringify({ assetName, issuer, subject, recordType })],
  );

  return mapRowToRecord(result.rows[0]);
};

export const getRecordById = async (id) => {
  await initializeRegistrySchema();

  const result = await query(
    `SELECT id, issuer, description, subject, record_type, status, hash, created_at
     FROM qr_objects
     WHERE id = $1`,
    [id],
  );

  if (result.rows[0]) {
    await query(
      `INSERT INTO qr_audit_log (object_id, event_type, event_payload)
       VALUES ($1, $2, $3::jsonb)`,
      [id, 'record_verified', JSON.stringify({ verifiedAt: new Date().toISOString() })],
    );
  }

  return mapRowToRecord(result.rows[0]);
};
