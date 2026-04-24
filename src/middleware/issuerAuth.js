import { authenticateIssuerApiKey } from '../services/issuerRegistry.js';

export const requireIssuerAuth = (req, res, next) => {
  const issuerId = req.header('x-issuer-id') || req.body?.issuer_id;
  const apiKey = req.header('x-api-key');

  if (!issuerId || !apiKey || !authenticateIssuerApiKey({ issuerId, apiKey })) {
    return res.status(401).json({
      error: 'Unauthorized issuer',
      code: 'ISSUER_AUTH_FAILED',
      details: ['Valid x-issuer-id and x-api-key are required'],
      timestamp_utc: new Date().toISOString(),
    });
  }

  return next();
};

