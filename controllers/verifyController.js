import { getRecordById } from '../services/registryService.js';

export const verifyRecordHandler = (req, res) => {
  const { id } = req.params;
  const record = getRecordById(id);

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
};
