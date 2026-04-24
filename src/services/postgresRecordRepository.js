import pg from 'pg';

const { Pool } = pg;

const mapRowToRecord = (row) => {
  if (!row) return null;
  return {
    qrvid: row.qrvid,
    recordType: (row.record_type || 'certificate').toUpperCase(),
    recipient: row.recipient,
    subject: row.subject,
    title: row.title,
    description: row.description,
    issuer: row.issuer_id,
    issuer_name: row.display_name || row.issuer_id,
    issuedAt: row.issued_at?.toISOString?.() || row.issued_at,
    expiresAt: row.expires_at?.toISOString?.() || row.expires_at,
    status: row.status,
    revokedAt: row.revoked_at?.toISOString?.() || row.revoked_at,
    hash: row.hash,
    signature: row.signature,
    metadata: row.metadata_json || {},
    createdAt: row.created_at?.toISOString?.() || row.created_at,
    updatedAt: row.updated_at?.toISOString?.() || row.updated_at,
  };
};

export const createPostgresRecordRepository = ({ connectionString }) => {
  const pool = new Pool({ connectionString });

  const writeAudit = async ({ qrvid = null, issuerId = null, action, actionStatus, detail = {} }) => {
    await pool.query(
      `INSERT INTO qr_audit_log (qrvid, issuer_id, action, action_status, detail)
       VALUES ($1, $2, $3, $4, $5::jsonb)`,
      [qrvid, issuerId, action, actionStatus, JSON.stringify(detail)],
    );
  };

  return {
    async createRecord(record) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        await client.query(
          `INSERT INTO qr_issuers (issuer_id, display_name, api_key_hash, status)
           VALUES ($1, $2, COALESCE((SELECT api_key_hash FROM qr_issuers WHERE issuer_id = $1), 'seeded'), 'ACTIVE')
           ON CONFLICT (issuer_id) DO UPDATE SET display_name = EXCLUDED.display_name, updated_at = NOW()`,
          [record.issuer, record.issuer_name || record.issuer],
        );

        await client.query(
          `INSERT INTO qr_objects (qrvid, issuer_id, record_type, subject, title, description, status, hash, signature, issued_at, expires_at, revoked_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NULL)`,
          [
            record.qrvid,
            record.issuer,
            'certificate',
            record.subject,
            record.title,
            record.description || '',
            'VERIFIED',
            record.hash,
            record.signature,
            record.issuedAt,
            record.expiresAt,
          ],
        );

        await client.query(
          `INSERT INTO qr_certificates (qrvid, recipient, metadata_json)
           VALUES ($1,$2,$3::jsonb)
           ON CONFLICT (qrvid) DO UPDATE SET recipient = EXCLUDED.recipient, metadata_json = EXCLUDED.metadata_json, updated_at = NOW()`,
          [record.qrvid, record.recipient, JSON.stringify(record.metadata || {})],
        );

        await client.query(
          `INSERT INTO qr_audit_log (qrvid, issuer_id, action, action_status, detail)
           VALUES ($1,$2,'CREATE','SUCCESS',$3::jsonb)`,
          [record.qrvid, record.issuer, JSON.stringify({ source: 'postgres' })],
        );

        await client.query('COMMIT');
        return { ok: true };
      } catch (error) {
        await client.query('ROLLBACK');
        if (error.code === '23505') {
          return { ok: false, code: 'QRVID_CONFLICT' };
        }
        throw error;
      } finally {
        client.release();
      }
    },

    async getByQrvid(qrvid) {
      const { rows } = await pool.query(
        `SELECT o.*, c.recipient, c.metadata_json, i.display_name
         FROM qr_objects o
         LEFT JOIN qr_certificates c ON c.qrvid = o.qrvid
         LEFT JOIN qr_issuers i ON i.issuer_id = o.issuer_id
         WHERE o.qrvid = $1`,
        [qrvid],
      );
      return mapRowToRecord(rows[0]);
    },

    async updateRecord(record) {
      await pool.query(
        `UPDATE qr_objects
         SET subject=$2, title=$3, description=$4, status=$5, hash=$6, signature=$7, issued_at=$8, expires_at=$9, revoked_at=$10, updated_at=NOW()
         WHERE qrvid=$1`,
        [
          record.qrvid,
          record.subject,
          record.title,
          record.description || '',
          record.status,
          record.hash,
          record.signature,
          record.issuedAt,
          record.expiresAt,
          record.revokedAt,
        ],
      );

      await pool.query(
        `UPDATE qr_certificates
         SET recipient=$2, metadata_json=$3::jsonb, updated_at=NOW()
         WHERE qrvid=$1`,
        [record.qrvid, record.recipient, JSON.stringify(record.metadata || {})],
      );
    },

    async revokeRecord(qrvid, { revokedAt, reason }) {
      const { rowCount } = await pool.query(
        `UPDATE qr_objects SET status='REVOKED', revoked_at=$2, updated_at=NOW() WHERE qrvid=$1`,
        [qrvid, revokedAt],
      );
      if (rowCount === 0) {
        return { ok: false, code: 'NOT_FOUND' };
      }

      const record = await this.getByQrvid(qrvid);
      await writeAudit({ qrvid, issuerId: record?.issuer || null, action: 'REVOKE', actionStatus: 'SUCCESS', detail: { reason } });
      return { ok: true, record };
    },

    async listIssuerRecords(issuerId) {
      const { rows } = await pool.query(
        `SELECT o.*, c.recipient, c.metadata_json, i.display_name
         FROM qr_objects o
         LEFT JOIN qr_certificates c ON c.qrvid = o.qrvid
         LEFT JOIN qr_issuers i ON i.issuer_id = o.issuer_id
         WHERE o.issuer_id = $1
         ORDER BY o.created_at DESC`,
        [issuerId],
      );
      return rows.map(mapRowToRecord);
    },

    writeAudit,
  };
};
