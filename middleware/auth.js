import { getIssuerFromRequest } from '../services/authService.js';

export const requireIssuerAuth = (req, res, next) => {
  const issuer = getIssuerFromRequest(req);
  if (!issuer) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized issuer session.',
    });
  }

  req.issuer = {
    ...issuer,
    id: issuer.id || issuer.issuerId,
    issuerId: issuer.issuerId || issuer.id,
    name: issuer.name || issuer.issuerName,
    issuerName: issuer.issuerName || issuer.name,
  };
  return next();
};
