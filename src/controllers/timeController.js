import {
  buildCanonicalTimestamp,
  gregorianToOT,
  otToGregorian,
} from '../services/timeConversionService.js';

const sendError = (res, status, code, message, details = undefined) => {
  res.status(status).json({
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  });
};

const parseTimezone = (candidate) => (typeof candidate === 'string' && candidate.trim() ? candidate.trim() : 'UTC');

export const healthHandler = (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'onegodian-api',
    standard: 'OTS-V5-corrected',
  });
};

export const getNowHandler = (req, res) => {
  try {
    const timezone = parseTimezone(req.query.timezone);
    res.status(200).json(buildCanonicalTimestamp(new Date(), timezone));
  } catch (error) {
    sendError(res, 400, 'INVALID_REQUEST', error.message);
  }
};

export const postGregorianToOTHandler = (req, res) => {
  const { inputDate, timezone: rawTz } = req.body ?? {};

  if (!inputDate) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'inputDate is required.');
  }

  try {
    const timezone = parseTimezone(rawTz);
    const conversion = gregorianToOT(inputDate, timezone);
    const canonical = buildCanonicalTimestamp(inputDate, timezone);

    return res.status(200).json({
      conversion,
      canonical,
    });
  } catch (error) {
    return sendError(res, 400, 'INVALID_REQUEST', error.message);
  }
};

export const postOTToGregorianHandler = (req, res) => {
  const { otYear, otMonth, otDay, timezone: rawTz } = req.body ?? {};

  if (![otYear, otMonth, otDay].every((value) => Number.isInteger(value))) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'otYear, otMonth, and otDay are required integers.');
  }

  try {
    const timezone = parseTimezone(rawTz);
    const conversion = otToGregorian(otYear, otMonth, otDay, timezone);
    const canonical = buildCanonicalTimestamp(`${conversion.gregorianDate}T00:00:00.000Z`, timezone);

    return res.status(200).json({
      conversion,
      canonical,
    });
  } catch (error) {
    return sendError(res, 400, 'INVALID_REQUEST', error.message);
  }
};

export const postNormalizeHandler = (req, res) => {
  const { inputDate, otYear, otMonth, otDay, timezone: rawTz } = req.body ?? {};
  const timezone = parseTimezone(rawTz);

  try {
    if (inputDate) {
      return res.status(200).json(buildCanonicalTimestamp(inputDate, timezone));
    }

    if ([otYear, otMonth, otDay].every((value) => Number.isInteger(value))) {
      const { gregorianDate } = otToGregorian(otYear, otMonth, otDay, timezone);
      return res.status(200).json(buildCanonicalTimestamp(`${gregorianDate}T00:00:00.000Z`, timezone));
    }

    return sendError(
      res,
      400,
      'VALIDATION_ERROR',
      'Provide either inputDate or all of otYear, otMonth, and otDay.',
    );
  } catch (error) {
    return sendError(res, 400, 'INVALID_REQUEST', error.message);
  }
};
