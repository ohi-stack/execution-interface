import { validators } from '../services/schemaRegistry.js';

export const validateBody = (validatorName) => (req, res, next) => {
  const validator = validators[validatorName];

  if (!validator) {
    return res.status(500).json({
      error: 'Validator not configured',
      code: 'VALIDATOR_MISSING',
      details: [validatorName],
      timestamp_utc: new Date().toISOString(),
    });
  }

  const result = validator(req.body);

  if (!result.isValid) {
    return res.status(400).json({
      error: 'Request validation failed',
      code: 'INVALID_REQUEST',
      details: result.errors,
      timestamp_utc: new Date().toISOString(),
    });
  }

  return next();
};
