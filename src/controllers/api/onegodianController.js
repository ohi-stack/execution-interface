import { convertDateTime, getCanonicalCurrentTime } from '../../services/onegodianApiService.js';

const ISO_UTC_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(?:\.\d{1,3})?)?Z$/;

const badRequest = (res, message) => res.status(400).json({
  ok: false,
  code: 'INVALID_REQUEST',
  error: message,
});

export const getCurrentOnegodianTime = async (_req, res) => {
  try {
    const payload = await getCanonicalCurrentTime();
    res.set('cache-control', 'no-store');
    return res.status(200).json({ ok: true, data: payload });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      code: 'UPSTREAM_UNAVAILABLE',
      error: 'Onegodian time service is currently unavailable.',
      detail: error.message,
    });
  }
};

export const getConvertedOnegodianTime = async (req, res) => {
  const isoUtc = String(req.query?.iso_utc || '').trim();

  if (!isoUtc) {
    return badRequest(res, 'Query parameter "iso_utc" is required.');
  }

  if (!ISO_UTC_PATTERN.test(isoUtc)) {
    return badRequest(res, 'Query parameter "iso_utc" must be an ISO-8601 UTC timestamp (example: 2026-04-09T12:00:00Z).');
  }

  try {
    const payload = await convertDateTime({ iso_utc: isoUtc });
    res.set('cache-control', 'no-store');
    return res.status(200).json({ ok: true, data: payload });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      code: 'UPSTREAM_UNAVAILABLE',
      error: 'Onegodian conversion service is currently unavailable.',
      detail: error.message,
    });
  }
};
