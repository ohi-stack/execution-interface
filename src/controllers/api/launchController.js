import crypto from 'node:crypto';
import {
  createIssuerAccount,
  getIssuerAccount,
  markFirstApiKeyGenerated,
  saveIssuerProfile,
  verifyIssuerEmail,
} from '../../services/accDb.js';
import { createCheckout, getPlanStatus, getPlans, updatePlan } from '../../services/billingService.js';
import { provisionApiKey } from '../../services/recordStore.js';

export const getPricing = (_req, res) => res.status(200).json({ plans: getPlans() });

export const postIssuerSignup = (req, res) => {
  const password_hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
  const { account, token } = createIssuerAccount({ email: req.body.email, password_hash, company_name: req.body.company_name });
  return res.status(201).json({ issuer_id: account.issuer_id, email: account.email, email_verified: account.email_verified, verification_token: token });
};

export const postVerifyEmail = (req, res) => {
  const account = verifyIssuerEmail(req.body.token);
  if (!account) return res.status(404).json({ error: 'Invalid verification token' });
  return res.status(200).json({ issuer_id: account.issuer_id, email_verified: true });
};

export const postIssuerProfile = (req, res) => {
  const account = saveIssuerProfile(req.params.issuer_id, req.body);
  if (!account) return res.status(404).json({ error: 'Issuer not found' });
  return res.status(200).json({ issuer_id: account.issuer_id, profile: account.profile });
};

export const postIssuerFirstApiKey = async (req, res) => {
  const account = getIssuerAccount(req.params.issuer_id);
  if (!account) return res.status(404).json({ error: 'Issuer not found' });

  const api_key = `qrv_live_${crypto.randomBytes(24).toString('hex')}`;
  const key_id = `key_${crypto.randomUUID()}`;
  await provisionApiKey({ key_id, issuer_id: req.params.issuer_id, api_key });
  markFirstApiKeyGenerated(req.params.issuer_id);
  return res.status(201).json({ issuer_id: req.params.issuer_id, key_id, api_key });
};

export const postIssueWizard = (req, res) => {
  return res.status(200).json({
    issuer_id: req.params.issuer_id,
    steps: [
      'Create certificate payload',
      'POST /api/v1/issuer/certificates',
      'Scan verify URL',
      'Optional revoke test',
    ],
    first_qrvid_hint: `QRV-${req.params.issuer_id.toUpperCase().slice(0, 6)}-000001`,
  });
};

export const postBillingCheckout = async (req, res) => {
  const checkout = await createCheckout(req.body);
  return res.status(201).json(checkout);
};

export const postBillingPlanChange = (req, res) => {
  const updated = updatePlan(req.params.issuer_id, req.body.plan);
  return res.status(200).json(updated);
};

export const getBillingStatus = (req, res) => res.status(200).json(getPlanStatus(req.params.issuer_id));
