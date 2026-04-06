import express from 'express';
import { query, withTransaction } from './lib/db.js';
import { sha256, sign } from './lib/hash.js';

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT || 4000);
const VERIFY_BASE_URL = process.env.VERIFY_BASE_URL || 'https://verify.qrv.network';
const SIGNING_SECRET = process.env.SIGNING_SECRET || 'dev-secret';
const ISSUER_NAME = process.env.ISSUER_NAME || 'QR-V';

const buildQrvid = async (client) => {
  const { rows } = await client.query(
    "SELECT qrvid FROM qr_objects WHERE qrvid LIKE 'QRV-CERT-%' ORDER BY qrvid DESC LIMIT 1"
  );

  const last = rows[0]?.qrvid;
  const nextNumber = last ? Number(last.replace('QRV-CERT-', '')) + 1 : 1;
  return `QRV-CERT-${String(nextNumber).padStart(6, '0')}`;
};

const mapVerifyStatus = (status, expiresAt) => {
  if (!status) return 'NOT_FOUND';
  if (status.toLowerCase() === 'revoked') return 'REVOKED';
  if (expiresAt && new Date(expiresAt).getTime() < Date.now()) return 'EXPIRED';
  return 'VERIFIED';
};

app.get('/health', async (_req, res) => {
  try {
    await query('SELECT 1');
    return res.json({ service: 'up', db: { ready: true } });
  } catch {
    return res.status(503).json({ service: 'up', db: { ready: false } });
  }
});

app.post('/registry/create', async (req, res) => {
  const { recordType, issuer, recipientName, certificateTitle, description } = req.body || {};

  if (!recordType || !issuer || !recipientName || !certificateTitle) {
    return res.status(400).json({
      error: 'recordType, issuer, recipientName, and certificateTitle are required',
    });
  }

  try {
    const payload = await withTransaction(async (client) => {
      const issuerCode = String(issuer).trim().toUpperCase();
      const issuerName = issuer || ISSUER_NAME;

      const issuerResult = await client.query(
        `INSERT INTO qr_issuers (issuer_code, issuer_name, status)
         VALUES ($1, $2, 'active')
         ON CONFLICT (issuer_code)
         DO UPDATE SET issuer_name = EXCLUDED.issuer_name
         RETURNING id, issuer_name`,
        [issuerCode, issuerName]
      );

      const qrvid = await buildQrvid(client);
      const issuedAt = new Date().toISOString();
      const canonicalPayload = {
        qrvid,
        recordType,
        issuer: issuerName,
        recipientName,
        certificateTitle,
        description: description || null,
        issuedAt,
      };

      const hash = sha256(canonicalPayload);
      const signature = sign(canonicalPayload, SIGNING_SECRET);

      const objectResult = await client.query(
        `INSERT INTO qr_objects
          (qrvid, record_type, issuer_id, status, payload_hash, signature, issued_at, created_at, updated_at)
         VALUES ($1, $2, $3, 'verified', $4, $5, $6, NOW(), NOW())
         RETURNING id, qrvid, status, payload_hash, issued_at`,
        [qrvid, recordType, issuerResult.rows[0].id, hash, signature, issuedAt]
      );

      await client.query(
        `INSERT INTO qr_certificates
          (qr_object_id, certificate_title, recipient_name, description, metadata_json)
         VALUES ($1, $2, $3, $4, $5::jsonb)`,
        [
          objectResult.rows[0].id,
          certificateTitle,
          recipientName,
          description || null,
          JSON.stringify({ source: 'qrv-api', createdBy: 'registry/create' }),
        ]
      );

      await client.query(
        `INSERT INTO qr_audit_log (qr_object_id, event_type, event_data_json)
         VALUES ($1, 'issued', $2::jsonb)`,
        [
          objectResult.rows[0].id,
          JSON.stringify({
            qrvid,
            issuer: issuerName,
            recordType,
            recipientName,
            certificateTitle,
          }),
        ]
      );

      return {
        qrvid: objectResult.rows[0].qrvid,
        status: objectResult.rows[0].status,
        hash: objectResult.rows[0].payload_hash,
        verifyUrl: `${VERIFY_BASE_URL.replace(/\/$/, '')}/${objectResult.rows[0].qrvid}`,
      };
    });

    return res.status(201).json(payload);
  } catch (error) {
    console.error('create failed', error);
    return res.status(500).json({ error: 'failed to create registry record' });
  }
});

app.get('/verify/:qrvid', async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT
        o.qrvid,
        o.record_type,
        o.status,
        o.payload_hash,
        o.issued_at,
        o.expires_at,
        i.issuer_name,
        c.recipient_name,
        c.certificate_title,
        c.description
      FROM qr_objects o
      JOIN qr_issuers i ON i.id = o.issuer_id
      LEFT JOIN qr_certificates c ON c.qr_object_id = o.id
      WHERE o.qrvid = $1
      LIMIT 1`,
      [req.params.qrvid]
    );

    const row = rows[0];
    if (!row) {
      return res.status(404).json({ status: 'NOT_FOUND', qrvid: req.params.qrvid });
    }

    const status = mapVerifyStatus(row.status, row.expires_at);
    return res.json({
      status,
      qrvid: row.qrvid,
      type: row.record_type,
      issuer: row.issuer_name,
      recipient: row.recipient_name,
      certificateTitle: row.certificate_title,
      description: row.description,
      hash: row.payload_hash,
      issuedAt: row.issued_at,
      expiresAt: row.expires_at,
    });
  } catch (error) {
    console.error('verify failed', error);
    return res.status(500).json({ error: 'failed to verify' });
  }
});

app.post('/revoke', async (req, res) => {
  const { qrvid, reason } = req.body || {};
  if (!qrvid) {
    return res.status(400).json({ error: 'qrvid is required' });
  }

  try {
    const response = await withTransaction(async (client) => {
      const updated = await client.query(
        `UPDATE qr_objects
         SET status = 'revoked', updated_at = NOW()
         WHERE qrvid = $1
         RETURNING id, qrvid, status`,
        [qrvid]
      );

      if (!updated.rows[0]) {
        return null;
      }

      await client.query(
        `INSERT INTO qr_audit_log (qr_object_id, event_type, event_data_json)
         VALUES ($1, 'revoked', $2::jsonb)`,
        [updated.rows[0].id, JSON.stringify({ qrvid, reason: reason || null })]
      );

      return updated.rows[0];
    });

    if (!response) {
      return res.status(404).json({ error: 'not found' });
    }

    return res.json(response);
  } catch (error) {
    console.error('revoke failed', error);
    return res.status(500).json({ error: 'failed to revoke' });
  }
});

app.listen(PORT, () => {
  console.log(`qrv-api listening on ${PORT}`);
});
