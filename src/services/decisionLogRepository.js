import crypto from 'node:crypto';

const decisions = new Map();
const order = [];

export const createDecisionRecord = (input) => {
  const decisionId = input.decisionId || crypto.randomUUID();
  const record = {
    decisionId,
    actorType: input.actorType,
    actorId: input.actorId,
    role: input.role,
    action: input.action,
    decision: input.decision,
    reason: input.reason,
    approvalStatus: input.approvalStatus,
    timestampUtc: input.timestampUtc || new Date().toISOString(),
    requestId: input.requestId,
  };

  decisions.set(decisionId, record);
  order.unshift(decisionId);

  return record;
};

export const getDecisionById = (decisionId) => decisions.get(decisionId) || null;

export const listDecisions = ({ limit = 20 } = {}) => {
  const capped = Math.max(1, Math.min(Number(limit) || 20, 100));
  return order.slice(0, capped).map((decisionId) => decisions.get(decisionId)).filter(Boolean);
};

export const resetDecisionLog = () => {
  decisions.clear();
  order.length = 0;
};
