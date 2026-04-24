import { buildErrorResponse } from '../utils/apiError.js';

const formatIssue = (issue) => {
  const path = issue.path.length ? `/${issue.path.join('/')}` : '/';
  return `${path}: ${issue.message}`;
};

export const validateZodBody = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json(buildErrorResponse({
      error: 'Request validation failed',
      code: 'INVALID_REQUEST',
      details: parsed.error.issues.map(formatIssue),
    }));
  }

  req.body = parsed.data;
  return next();
};

export const validateZodParams = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.params);

  if (!parsed.success) {
    return res.status(400).json(buildErrorResponse({
      error: 'Path validation failed',
      code: 'INVALID_PATH_PARAM',
      details: parsed.error.issues.map(formatIssue),
    }));
  }

  req.params = parsed.data;
  return next();
};
