import { createRecord } from '../services/registryService.js';

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
    });

    const verifyBaseUrl = process.env.VERIFY_BASE_URL || 'https://verify.qrv.network';

    console.log(`Created verification record ${record.id} for asset "${record.assetName}".`);

    return res.status(201).json({
      success: true,
      id: record.id,
      verifyUrl: `${verifyBaseUrl}/${record.id}`,
    });
  } catch (error) {
    return next(error);
  }
};
