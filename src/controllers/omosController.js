import { classifyIdentity, getIdentityDefinition } from '../services/omos/identityService.js';
import { runAlignmentChecks } from '../services/omos/alignmentService.js';
import { buildTimestampRecord, otToUtc, utcToOt } from '../services/omos/timeService.js';
import { runOnegodianDecision } from '../services/omos/algorithmService.js';

const handleError = (res, error) => {
  res.status(400).json({
    code: 'OMOS_BAD_REQUEST',
    message: error.message,
  });
};

export const classifyHandler = (req, res) => {
  try {
    const result = classifyIdentity(req.body ?? {});
    res.json({ ok: true, result });
  } catch (error) {
    handleError(res, error);
  }
};

export const identityDefinitionHandler = (_req, res) => {
  res.json({
    ok: true,
    result: getIdentityDefinition(),
  });
};

export const alignHandler = (req, res) => {
  try {
    const result = runAlignmentChecks(req.body ?? {});
    res.json({ ok: true, result });
  } catch (error) {
    handleError(res, error);
  }
};

export const timestampConvertHandler = (req, res) => {
  try {
    const { from, timestamp_utc, ot_year, ot_day_of_year } = req.body ?? {};

    if (from === 'utc') {
      const record = buildTimestampRecord(timestamp_utc);
      return res.json({ ok: true, result: record });
    }

    if (from === 'ot') {
      const utcDate = otToUtc({ year: Number(ot_year), dayOfYear: Number(ot_day_of_year) });
      return res.json({ ok: true, result: {
        timestamp_utc: utcDate.toISOString(),
        timestamp_ot: utcToOt(utcDate.toISOString()),
      } });
    }

    throw new Error('from must be either "utc" or "ot"');
  } catch (error) {
    return handleError(res, error);
  }
};

export const decisionRunHandler = (req, res) => {
  try {
    const result = runOnegodianDecision(req.body ?? {});
    res.json({ ok: true, result });
  } catch (error) {
    handleError(res, error);
  }
};
