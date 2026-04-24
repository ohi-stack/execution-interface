import { issuerAdminService } from '../services/issuerAdminService.js';

export const createIssuerHandler = async (req, res) => {
  const { issuerId, displayName, apiKey } = req.body || {};
  if (!issuerId || !displayName || !apiKey) {
    return res.status(400).json({
      error: 'Invalid request',
      code: 'INVALID_REQUEST',
      details: ['issuerId, displayName, apiKey are required'],
      timestamp_utc: new Date().toISOString(),
    });
  }

  const issuer = await issuerAdminService.createIssuer({ issuerId, displayName, apiKey });
  return res.status(201).json({ issuer });
};

export const rotateIssuerKeyHandler = async (req, res) => {
  const { issuerId } = req.params;
  const { apiKey } = req.body || {};
  if (!apiKey) {
    return res.status(400).json({ error: 'Invalid request', code: 'INVALID_REQUEST', details: ['apiKey is required'], timestamp_utc: new Date().toISOString() });
  }

  const issuer = await issuerAdminService.rotateApiKey({ issuerId, apiKey });
  if (!issuer) {
    return res.status(404).json({ error: 'Issuer not found', code: 'NOT_FOUND', details: [issuerId], timestamp_utc: new Date().toISOString() });
  }

  return res.status(200).json({ issuer });
};

export const suspendIssuerHandler = async (req, res) => {
  const { issuerId } = req.params;
  const issuer = await issuerAdminService.suspendIssuer({ issuerId });
  if (!issuer) {
    return res.status(404).json({ error: 'Issuer not found', code: 'NOT_FOUND', details: [issuerId], timestamp_utc: new Date().toISOString() });
  }

  return res.status(200).json({ issuer });
};
