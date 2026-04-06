import { login, validateAccessToken } from '../services/authService.js';

const extractBearerToken = (req) => {
  const authHeader = req.header('authorization');
  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

export const postLogin = (req, res) => {
  const result = login(req.body || {});
  if (!result.ok) {
    return res.status(401).json({
      error: result.message,
      code: result.code,
      timestamp_utc: new Date().toISOString(),
    });
  }

  return res.status(200).json(result);
};

export const getValidate = (req, res) => {
  const token = extractBearerToken(req);
  const result = validateAccessToken(token);

  if (!result.ok) {
    return res.status(401).json({
      valid: false,
      error: result.message,
      code: result.code,
      timestamp_utc: new Date().toISOString(),
    });
  }

  return res.status(200).json({
    valid: true,
    claims: result.payload,
  });
};

export const getRoles = (req, res) => res.status(200).json({
  subject: req.auth.sub,
  role: req.auth.role,
  roles: req.auth.roles || [req.auth.role],
});
