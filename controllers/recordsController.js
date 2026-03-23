import {
  createRecordInRegistry,
  getAllRecords,
  revokeRecordByQRVID,
} from '../services/registryService.js';
import { normalizeQRVID, validateQRVID } from '../utils/qrvid.js';

// --- Helpers ---

const MAX_METADATA_SIZE = 5000;

const normalizeMetadata = (value) => {
  if (!value) return {};

  let parsed = {};

  if (typeof value === 'object') {
    parsed = value;
  } else if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value);
    } catch {
      parsed = { raw: value };
    }
  }

  const size = JSON.stringify(parsed).length;
  if (size > MAX_METADATA_SIZE) {
    throw new Error('Metadata too large');
  }

  return parsed;
};

// --- Controllers ---

export async function createRecord(req, res) {
  try {
    const assetName = typeof req.body?.assetName === 'string' ? req.body.assetName.trim() : '';
    const recipientName = typeof req.body?.recipientName === 'string' ? req.body.recipientName.trim() : '';
    const description = typeof req.body?.description === 'string' ? req.body.description.trim() : '';
    const recordType = typeof req.body?.recordType === 'string' ? req.body.recordType.trim() : 'certificate';

    if (!assetName || !recipientName || !description) {
      return res.status(400).json({
        success: false,
        error: 'assetName, recipientName, and description are required.',
      });
    }

    if (!req.issuer || !req.issuer.id) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized issuer context.',
      });
    }

    const metadata = normalizeMetadata(req.body?.metadata);

    const record = await createRecordInRegistry({
      issuer: req.issuer,
      recordType,
      assetName,
      recipientName,
      description,
      metadata,
      requestMeta: {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString(),
      },
    });

    return res.status(200).json({ success: true, record });
  } catch (error) {
    console.error('Failed to create record:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to create record.' });
  }
}

export async function getRecords(req, res) {
  try {
    if (!req.issuer) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const records = await getAllRecords();

    return res.status(200).json({ success: true, records });
  } catch (error) {
    console.error('Failed to fetch records:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch records.' });
  }
}

export async function revokeRecord(req, res) {
  try {
    const rawQrvid = typeof req.body?.qrvid === 'string' ? req.body.qrvid.trim() : '';
    const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim() : 'Revoked by issuer';

    if (!validateQRVID(rawQrvid)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid qrvid format.',
      });
    }

    if (!req.issuer || !req.issuer.id) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized issuer context.',
      });
    }

    const qrvid = normalizeQRVID(rawQrvid);
    const record = await revokeRecordByQRVID({
      qrvid,
      reason,
      issuer: req.issuer,
      requestMeta: {
        ip: req.ip,
        timestamp: new Date().toISOString(),
      },
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found.',
      });
    }

    return res.status(200).json({ success: true, record });
  } catch (error) {
    console.error('Failed to revoke record:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to revoke record.' });
  }
}
