import { convertDateTime, getCanonicalCurrentTime } from '../../services/onegodianApiService.js';

export const getCurrentOnegodianTime = async (_req, res) => {
  try {
    const payload = await getCanonicalCurrentTime();
    return res.status(200).json({ ok: true, data: payload });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      error: 'Onegodian time service is currently unavailable.',
      detail: error.message,
    });
  }
};

export const getConvertedOnegodianTime = async (req, res) => {
  try {
    const payload = await convertDateTime(req.query);
    return res.status(200).json({ ok: true, data: payload });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      error: 'Onegodian conversion service is currently unavailable.',
      detail: error.message,
    });
  }
};
