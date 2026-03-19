import { getRecordById } from '../services/registryService.js';

export const verifyRecordHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await getRecordById(id);

    if (!record) {
      console.warn(`Verification requested for unknown record ${id}.`);
      return res.status(404).json({
        status: 'NOT_FOUND',
      });
    }

    console.log(`Verification successful for record ${id}.`);

    return res.status(200).json({
      status: 'VERIFIED',
      record,
    });
  } catch (error) {
    return next(error);
  }
};
