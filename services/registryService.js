import { generateRecordId } from '../utils/idGenerator.js';
import { query } from './databaseService.js';

const CREATE_TABLE_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS qr_objects (
    id TEXT PRIMARY KEY,
    asset_name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'valid',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS qr_certificates (
    id SERIAL PRIMARY KEY,
    object_id TEXT NOT NULL REFERENCES qr_objects(id) ON DELETE CASCADE,
    certificate_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS qr_audit_log (
    id BIGSERIAL PRIMARY KEY,
    object_id TEXT REFERENCES qr_objects(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    event_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
];

let schemaInitialized = false;

const mapRowToRecord = (row) => {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    assetName: row.asset_name,
    issuer: row.issuer,
    description: row.description,
    status: row.status,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  };
};

export const initializeRegistrySchema = async () => {
  if (schemaInitialized) {
    return;
  }

  for (const statement of CREATE_TABLE_STATEMENTS) {
    await query(statement);
  }

  schemaInitialized = true;
};

export const createRecord = async ({ assetName, issuer, description }) => {
  await initializeRegistrySchema();

  const id = generateRecordId();
  const result = await query(
    `INSERT INTO qr_objects (id, asset_name, issuer, description)
     VALUES ($1, $2, $3, $4)
     RETURNING id, asset_name, issuer, description, status, created_at`,
    [id, assetName, issuer, description],
  );

  await query(
    `INSERT INTO qr_audit_log (object_id, event_type, event_payload)
     VALUES ($1, $2, $3::jsonb)`,
    [id, 'record_created', JSON.stringify({ assetName, issuer })],
  );

  return mapRowToRecord(result.rows[0]);
};

export const getRecordById = async (id) => {
  await initializeRegistrySchema();

  const result = await query(
    `SELECT id, asset_name, issuer, description, status, created_at
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
