import crypto from 'node:crypto';
import { createRecord, listRecords, revokeRecord, seedDemoRecord } from '../services/recordStore.js';
import { signRecordHash } from '../services/issuerRegistry.js';
import { renderIssuerView } from '../views/issuerView.js';
import { env } from '../config/env.js';

const nowUtc = () => new Date().toISOString();

const verifyBaseUrl = () => env.VERIFY_BASE_URL;
let sequence = 1;

const generateQrvid = () => {
  const id = `${sequence}`.padStart(6, '0');
  sequence += 1;
  return `QRV-PROD-CERT-${id}`;
};

export const renderIssuerConsole = (_req, res) => {
  seedDemoRecord();
  return res.status(200).send(renderIssuerView({ records: listRecords(), verifyBaseUrl: verifyBaseUrl() }));
};

export const postIssueCertificate = (req, res) => {
  const qrvid = ((req.body?.qrvid || '').trim().toUpperCase()) || generateQrvid();
  const issuerId = 'issuer-onegodian-001';
  const metadataHash = crypto.createHash('sha256').update(`${qrvid}:${Date.now()}`).digest('hex');
  const payload = {
    qrvid,
    issuer: req.body?.issuer || env.ISSUER_NAME,
    issuer_id: issuerId,
    subject: req.body?.recipient || '',
    recipient: req.body?.recipient || '',
    certificate_title: req.body?.certificate_title || '',
    record_type: req.body?.record_type || 'CERTIFICATE',
    issued_at_utc: nowUtc(),
    metadata_hash: metadataHash,
    signature: signRecordHash({ issuerId, hash: metadataHash }),
  };

  const created = createRecord(payload);
  if (!created.ok) {
    return res.status(400).send(renderIssuerView({
      records: listRecords(),
      verifyBaseUrl: verifyBaseUrl(),
      error: created.error?.details?.join(', ') || created.error?.error || 'Unable to issue certificate',
    }));
  }

  return res.redirect('/issuer');
};

export const postIssuerRevoke = (req, res) => {
  revokeRecord(req.body.qrvid, {
    revoked_at_utc: nowUtc(),
    reason: req.body.reason || 'Issuer action',
  });

  return res.redirect('/issuer');
};
