import crypto from 'node:crypto';
import pg from 'pg';

const { Pool } = pg;

const now = () => new Date().toISOString();

const hashKey = (value) => crypto.createHash('sha256').update(value).digest('hex');

const memoryIssuers = new Map();

const memoryService = {
  async createIssuer({ issuerId, displayName, apiKey }) {
    const record = {
      issuer_id: issuerId,
      display_name: displayName,
      api_key_hash: hashKey(apiKey),
      status: 'ACTIVE',
      created_at: now(),
      updated_at: now(),
    };
    memoryIssuers.set(issuerId, record);
    return record;
  },
  async rotateApiKey({ issuerId, apiKey }) {
    const existing = memoryIssuers.get(issuerId);
    if (!existing) return null;
    existing.api_key_hash = hashKey(apiKey);
    existing.updated_at = now();
    return existing;
  },
  async suspendIssuer({ issuerId }) {
    const existing = memoryIssuers.get(issuerId);
    if (!existing) return null;
    existing.status = 'DISABLED';
    existing.updated_at = now();
    return existing;
  },
  async audit() {
    return;
  },
};

const postgresService = (() => {
  if (!process.env.DATABASE_URL) return null;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const audit = async (issuerId, action, detail) => {
    await pool.query(
      `INSERT INTO qr_audit_log (issuer_id, action, action_status, detail)
       VALUES ($1,$2,'SUCCESS',$3::jsonb)`,
      [issuerId, action, JSON.stringify(detail)],
    );
  };

  return {
    async createIssuer({ issuerId, displayName, apiKey }) {
      const apiKeyHash = hashKey(apiKey);
      const { rows } = await pool.query(
        `INSERT INTO qr_issuers (issuer_id, display_name, api_key_hash, status)
         VALUES ($1,$2,$3,'ACTIVE')
         ON CONFLICT (issuer_id)
         DO UPDATE SET display_name=EXCLUDED.display_name, api_key_hash=EXCLUDED.api_key_hash, status='ACTIVE', updated_at=NOW()
         RETURNING issuer_id, display_name, status, created_at, updated_at`,
        [issuerId, displayName, apiKeyHash],
      );
      await audit(issuerId, 'ISSUER_CREATE', { displayName });
      return rows[0];
    },
    async rotateApiKey({ issuerId, apiKey }) {
      const apiKeyHash = hashKey(apiKey);
      const { rows } = await pool.query(
        `UPDATE qr_issuers SET api_key_hash=$2, updated_at=NOW()
         WHERE issuer_id=$1
         RETURNING issuer_id, display_name, status, created_at, updated_at`,
        [issuerId, apiKeyHash],
      );
      if (!rows[0]) return null;
      await audit(issuerId, 'ISSUER_ROTATE_KEY', {});
      return rows[0];
    },
    async suspendIssuer({ issuerId }) {
      const { rows } = await pool.query(
        `UPDATE qr_issuers SET status='DISABLED', updated_at=NOW()
         WHERE issuer_id=$1
         RETURNING issuer_id, display_name, status, created_at, updated_at`,
        [issuerId],
      );
      if (!rows[0]) return null;
      await audit(issuerId, 'ISSUER_SUSPEND', {});
      return rows[0];
    },
    audit,
  };
})();

export const issuerAdminService = postgresService || memoryService;
