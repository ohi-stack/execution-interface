import { validators } from '../services/schemaRegistry.js';
import { buildErrorResponse } from '../utils/apiError.js';

export const validateBody = (validatorName) => (req, res, next) => {
  const validator = validators[validatorName];

  if (!validator) {
    return res.status(500).json(buildErrorResponse({
      error: 'Validator not configured',
      code: 'VALIDATOR_MISSING',
      details: [validatorName],
    }));
  }

  const result = validator(req.body);

  if (!result.isValid) {
    return res.status(400).json(buildErrorResponse({
      error: 'Request validation failed',
      code: 'INVALID_REQUEST',
      details: result.errors,
    }));
  }

  return next();
};
