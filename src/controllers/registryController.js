import { createRecord, getRecordById } from '../services/registryService.js';
import { sanitizeQRVID } from '../utils/qrvid.js';

const requiredFields = ['assetName', 'issuer', 'description'];

export const createRecordHandler = async (req, res, next) => {
  try {
    const payload = req.body ?? {};
    const missingFields = requiredFields.filter((field) => {
      const value = payload[field];
      return typeof value !== 'string' || value.trim().length === 0;
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body.',
        missingFields,
      });
    }

    const record = await createRecord({
      assetName: payload.assetName.trim(),
      issuer: payload.issuer.trim(),
      description: payload.description.trim(),
      subject: typeof payload.subject === 'string' && payload.subject.trim() ? payload.subject.trim() : null,
      recordType: typeof payload.recordType === 'string' && payload.recordType.trim() ? payload.recordType.trim() : 'REGISTRY_RECORD',
    });

    const verifyBaseUrl = process.env.VERIFY_BASE_URL || 'https://verify.qrv.network';

    return res.status(201).json({
      success: true,
      id: record.id,
      verifyUrl: `${verifyBaseUrl}/${record.id}`,
      record,
    });
  } catch (error) {
    return next(error);
  }
};

export const verifyRecordHandler = async (req, res, next) => {
  try {
    const id = sanitizeQRVID(req.params.qrvid || req.params.id || '');
    const record = await getRecordById(id);

    if (!record) {
      return res.status(404).json({
        status: 'INVALID',
        message: 'Record not found',
      });
    }

    return res.status(200).json({
      status: 'VERIFIED',
      issuer: record.issuer,
      recordType: record.recordType,
      subject: record.subject,
      timestamp: record.timestamp,
      hash: record.hash,
      message: 'Verification result available',
      record,
    });
  } catch (error) {
    return next(error);
  }
};
