import { authenticateIssuer, createSessionToken, getIssuerFromRequest } from '../services/authService.js';
import { clearSessionCookie, setSessionCookie } from '../utils/http.js';

export const loginHandler = (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const issuer = authenticateIssuer({ email, password });
  if (!issuer) {
    return res.status(401).json({ success: false, error: 'Invalid issuer credentials.' });
  }

  setSessionCookie(res, createSessionToken(issuer));
  return res.status(200).json({ success: true, issuer });
};

export const logoutHandler = (_req, res) => {
  clearSessionCookie(res);
  return res.status(200).json({ success: true });
};

export const sessionHandler = (req, res) => {
  const issuer = getIssuerFromRequest(req);
  if (!issuer) {
    return res.status(401).json({ authenticated: false });
  }

  return res.status(200).json({ authenticated: true, issuer });
};
