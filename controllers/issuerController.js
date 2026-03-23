import { createRecord, listRecords, revokeRecord } from '../services/registryService.js';

const normalizeMetadata = (value) => {
  if (!value) {
    return {};
  }

  if (typeof value === 'object') {
    return value;
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return { raw: value };
    }
  }

  return {};
};

export const listRecordsHandler = async (_req, res, next) => {
  try {
    const records = await listRecords();
    return res.status(200).json({ success: true, records });
  } catch (error) {
    return next(error);
  }
};

export const createRecordHandler = async (req, res, next) => {
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

    const record = await createRecord({
      issuer: req.issuer,
      recordType,
      assetName,
      recipientName,
      description,
      metadata: normalizeMetadata(req.body?.metadata),
    });

    return res.status(201).json({ success: true, record });
  } catch (error) {
    return next(error);
  }
};

export const revokeRecordHandler = async (req, res, next) => {
  try {
    const qrvid = typeof req.body?.qrvid === 'string' ? req.body.qrvid.trim() : '';
    const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim() : 'Revoked by issuer';

    if (!qrvid) {
      return res.status(400).json({ success: false, error: 'qrvid is required.' });
    }

    const record = await revokeRecord({ qrvid, reason, issuer: req.issuer });
    if (!record) {
      return res.status(404).json({ success: false, error: 'Record not found.' });
    }

    return res.status(200).json({ success: true, record });
  } catch (error) {
    return next(error);
  }
};
