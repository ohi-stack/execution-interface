import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validators } from './schemaRegistry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const policyPath = path.resolve(__dirname, '../../governance/policy.yaml');

const rawPolicy = fs.readFileSync(policyPath, 'utf8');
const policy = JSON.parse(rawPolicy);

export const evaluatePolicy = ({ action, actorRole = 'anonymous' }) => {
  const rule = policy.actions?.[action];
  const evaluated_at_utc = new Date().toISOString();

  if (!rule) {
    return {
      decision: 'deny',
      reason: `No policy rule for action: ${action}`,
      obligations: ['manual_review_required'],
      evaluated_at_utc,
    };
  }

  if (Array.isArray(rule.allow_roles) && rule.allow_roles.includes(actorRole)) {
    return {
      decision: 'allow',
      reason: `Role ${actorRole} is authorized for ${action}`,
      obligations: rule.obligations || [],
      evaluated_at_utc,
    };
  }

  return {
    decision: 'deny',
    reason: `Role ${actorRole} is not authorized for ${action}`,
    obligations: ['escalate_to_admin'],
    evaluated_at_utc,
  };
};

export const enforcePolicy = (action) => (req, res, next) => {
  const actor = req.auth?.role || req.header('x-actor-role') || 'anonymous';
  const decision = evaluatePolicy({ action, actorRole: actor });
  const validation = validators.policyDecision(decision);

  if (!validation.isValid) {
    return res.status(500).json({
      error: 'Policy decision validation failed',
      code: 'POLICY_DECISION_INVALID',
      details: validation.errors,
      timestamp_utc: new Date().toISOString(),
    });
  }

  req.policyDecision = decision;

  if (decision.decision !== 'allow') {
    return res.status(403).json({
      error: 'Policy denied action',
      code: 'POLICY_DENY',
      details: [decision.reason],
      obligations: decision.obligations,
      timestamp_utc: new Date().toISOString(),
    });
  }

  return next();
};
