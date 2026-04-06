import { validateAccessToken } from '../services/authService.js';

const unauthorized = (res, code, message) => res.status(401).json({
  error: message,
  code,
  timestamp_utc: new Date().toISOString(),
});

const forbidden = (res, message) => res.status(403).json({
  error: message,
  code: 'RBAC_FORBIDDEN',
  timestamp_utc: new Date().toISOString(),
});

const bearerToken = (req) => {
  const value = req.header('authorization');
  if (!value) {
    return null;
  }

  const [scheme, token] = value.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

export const authenticateToken = (req, res, next) => {
  const token = bearerToken(req);
  if (!token) {
    return unauthorized(res, 'TOKEN_MISSING', 'Bearer token is required.');
  }

  const verification = validateAccessToken(token);
  if (!verification.ok) {
    return unauthorized(res, verification.code, verification.message);
  }

  req.auth = verification.payload;
  return next();
};

export const requireRoles = (allowedRoles = []) => (req, res, next) => {
  const role = req.auth?.role;
  if (!role) {
    return forbidden(res, 'Role claim missing in token.');
  }

  if (!allowedRoles.includes(role)) {
    return forbidden(res, `Role ${role} is not allowed for this endpoint.`);
  }

  return next();
};
