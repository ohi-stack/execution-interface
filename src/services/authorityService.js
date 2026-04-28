import crypto from 'node:crypto';

import { createDecisionRecord } from './decisionLogRepository.js';

const authorityModel = {
  version: '0.1.0',
  name: 'acc-authority-model',
  actions: {
    create_record: {
      allowRoles: ['issuer', 'admin'],
      approvalRequired: false,
    },
    secret_access: {
      allowRoles: ['security_admin'],
      approvalRequired: false,
    },
    production_deploy: {
      allowRoles: ['release_manager'],
      approvalRequired: true,
    },
  },
};

const asString = (value) => (typeof value === 'string' ? value.trim() : '');

const buildRequestId = (requestIdFromBody, requestIdFromHeader) => {
  const bodyRequestId = asString(requestIdFromBody);
  if (bodyRequestId) return bodyRequestId;

  const headerRequestId = asString(requestIdFromHeader);
  if (headerRequestId) return headerRequestId;

  return crypto.randomUUID();
};

const evaluate = ({ actorType, actorId, role, action, requestId }) => {
  const rule = authorityModel.actions[action];

  if (!rule) {
    return createDecisionRecord({
      actorType,
      actorId,
      role,
      action,
      decision: 'deny',
      reason: `Unknown action: ${action}`,
      approvalStatus: 'not_required',
      requestId,
    });
  }

  if (!rule.allowRoles.includes(role)) {
    return createDecisionRecord({
      actorType,
      actorId,
      role,
      action,
      decision: 'deny',
      reason: `Role ${role} is not authorized for ${action}`,
      approvalStatus: 'not_required',
      requestId,
    });
  }

  if (rule.approvalRequired) {
    return createDecisionRecord({
      actorType,
      actorId,
      role,
      action,
      decision: 'approval_required',
      reason: `Action ${action} requires approval workflow`,
      approvalStatus: 'required',
      requestId,
    });
  }

  return createDecisionRecord({
    actorType,
    actorId,
    role,
    action,
    decision: 'allow',
    reason: `Role ${role} is authorized for ${action}`,
    approvalStatus: 'not_required',
    requestId,
  });
};

export const getAuthorityModel = () => authorityModel;

export const authorize = ({ payload, requestIdHeader }) => {
  const actorType = asString(payload?.actorType);
  const actorId = asString(payload?.actorId);
  const role = asString(payload?.role);
  const action = asString(payload?.action);
  const requestId = buildRequestId(payload?.requestId, requestIdHeader);

  const missing = [];
  if (!actorType) missing.push('actorType is required');
  if (!actorId) missing.push('actorId is required');
  if (!role) missing.push('role is required');
  if (!action) missing.push('action is required');

  if (missing.length > 0) {
    const decisionRecord = createDecisionRecord({
      actorType: actorType || 'unknown',
      actorId: actorId || 'unknown',
      role: role || 'unknown',
      action: action || 'unknown',
      decision: 'deny',
      reason: `Invalid authorization payload: ${missing.join('; ')}`,
      approvalStatus: 'not_required',
      requestId,
    });

    return {
      ok: false,
      statusCode: 400,
      error: {
        error: 'Invalid authorization payload',
        code: 'INVALID_REQUEST',
        details: missing,
      },
      decisionRecord,
    };
  }

  const decisionRecord = evaluate({ actorType, actorId, role, action, requestId });

  return {
    ok: true,
    statusCode: decisionRecord.decision === 'allow' ? 200 : decisionRecord.decision === 'approval_required' ? 202 : 403,
    decisionRecord,
  };
};
