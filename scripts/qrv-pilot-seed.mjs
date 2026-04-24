import crypto from 'node:crypto';
import process from 'node:process';
import pg from 'pg';

const { Client } = pg;

const requiredEnv = ['DATABASE_URL', 'QRV_SIGNING_SECRET', 'QRV_ISSUER_KEYS'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const QRVID = 'QRV-PROD-CERT-000001';
const ISSUER_ID = 'onegodian-llc';
const ISSUER_NAME = 'ONEGODIAN, LLC';
const RECORD_TYPE = 'certificate';
const SUBJECT = 'QR-V Genesis Verification Certificate';
const TITLE = 'QR-V Genesis Verification Certificate';
const DESCRIPTION = 'Pilot genesis certificate used for QR-V production activation.';
const ISSUED_AT = '2026-04-24T00:00:00Z';
const EXPIRES_AT = null;
const RECIPIENT = 'ONEGODIAN, LLC';
const METADATA = { pilot: true, phase: 'v1', date: '2026-04-24' };

const parseIssuerKeys = () => new Map(
  process.env.QRV_ISSUER_KEYS
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => entry.split(':').map((v) => v.trim()))
    .filter(([issuer, key]) => issuer && key)
);

const issuerKeys = parseIssuerKeys();
const issuerApiKey = issuerKeys.get(ISSUER_ID);
if (!issuerApiKey) {
  console.error(`QRV_ISSUER_KEYS must include ${ISSUER_ID}:<api-key>`);
  process.exit(1);
}

const hash = crypto.createHash('sha256').update(JSON.stringify({
  qrvid: QRVID,
  issuer: ISSUER_NAME,
  recordType: RECORD_TYPE,
  subject: SUBJECT,
  title: TITLE,
  description: DESCRIPTION,
  issuedAt: ISSUED_AT,
  expiresAt: EXPIRES_AT,
  metadata: METADATA,
})).digest('hex');

const signature = crypto.createHmac('sha256', process.env.QRV_SIGNING_SECRET)
  .update(`${QRVID}:${hash}`)
  .digest('hex');

const issuerKeyHash = crypto.createHash('sha256').update(issuerApiKey).digest('hex');

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

try {
  await client.query('BEGIN');

  await client.query(
    `INSERT INTO qr_issuers (issuer_id, display_name, api_key_hash, status)
     VALUES ($1, $2, $3, 'ACTIVE')
     ON CONFLICT (issuer_id)
     DO UPDATE SET display_name = EXCLUDED.display_name, api_key_hash = EXCLUDED.api_key_hash, status='ACTIVE', updated_at = NOW()`,
    [ISSUER_ID, ISSUER_NAME, issuerKeyHash],
  );

  await client.query(
    `INSERT INTO qr_objects (
      qrvid, issuer_id, record_type, subject, title, description, status, hash, signature, issued_at, expires_at, revoked_at
    ) VALUES ($1,$2,$3,$4,$5,$6,'VERIFIED',$7,$8,$9,$10,NULL)
     ON CONFLICT (qrvid)
     DO UPDATE SET issuer_id = EXCLUDED.issuer_id, record_type = EXCLUDED.record_type, subject = EXCLUDED.subject,
      title = EXCLUDED.title, description = EXCLUDED.description, status = 'VERIFIED', hash = EXCLUDED.hash,
      signature = EXCLUDED.signature, issued_at = EXCLUDED.issued_at, expires_at = EXCLUDED.expires_at,
      revoked_at = NULL, updated_at = NOW()`,
    [QRVID, ISSUER_ID, RECORD_TYPE, SUBJECT, TITLE, DESCRIPTION, hash, signature, ISSUED_AT, EXPIRES_AT],
  );

  await client.query(
    `INSERT INTO qr_certificates (qrvid, recipient, metadata_json)
     VALUES ($1,$2,$3::jsonb)
     ON CONFLICT (qrvid)
     DO UPDATE SET recipient = EXCLUDED.recipient, metadata_json = EXCLUDED.metadata_json, updated_at = NOW()`,
    [QRVID, RECIPIENT, JSON.stringify(METADATA)],
  );

  await client.query(
    `INSERT INTO qr_audit_log (qrvid, issuer_id, action, action_status, detail)
     VALUES ($1, $2, 'SEED_CERTIFICATE', 'SUCCESS', $3::jsonb)`,
    [QRVID, ISSUER_ID, JSON.stringify({ hash, signature, source: 'scripts/qrv-pilot-seed.mjs' })],
  );

  await client.query('COMMIT');
  console.log('Seed complete for canonical pilot certificate.');
  console.log('Verification URL: https://verify.qrv.network/QRV-PROD-CERT-000001');
} catch (error) {
  await client.query('ROLLBACK');
  console.error('Seed failed:', error.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
