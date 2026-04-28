import crypto from 'node:crypto';
import { getPrismaClient } from './prismaClient.js';

const fallback = new Map();

const nowUtc = () => new Date().toISOString();

const stableStringify = (value) => JSON.stringify(value, Object.keys(value || {}).sort());
const hashValue = (value) => crypto.createHash('sha256').update(typeof value === 'string' ? value : stableStringify(value ?? {})).digest('hex');

const mapDecision = (record) => ({
  ...record,
  timestampUtc: new Date(record.timestampUtc).toISOString(),
  createdAt: new Date(record.createdAt).toISOString(),
  authorityScope: record.authorityScope || {},
});

export const createDecisionLog = async (payload) => {
  const prisma = await getPrismaClient();
  const record = {
    decisionId: payload.decisionId || crypto.randomUUID(),
    executionId: payload.executionId || null,
    workflowId: payload.workflowId || null,
    tenantId: payload.tenantId || null,
    actorType: payload.actorType || 'user',
    actorId: payload.actorId || 'anonymous',
    agentId: payload.agentId || null,
    role: payload.role || 'anonymous',
    action: payload.action,
    resource: payload.resource || null,
    environment: payload.environment || (process.env.NODE_ENV || 'development'),
    authorityScope: payload.authorityScope || {},
    policyId: payload.policyId || null,
    policyHash: payload.policyHash || null,
    inputHash: payload.inputHash || hashValue(payload.input || {}),
    outputHash: payload.outputHash || hashValue(payload.output || {}),
    riskLevel: payload.riskLevel || 'low',
    decision: payload.decision,
    reason: payload.reason,
    approvalStatus: payload.approvalStatus || 'not_required',
    approvalLevel: payload.approvalLevel || null,
    requestId: payload.requestId || crypto.randomUUID(),
    timestampUtc: payload.timestampUtc ? new Date(payload.timestampUtc) : new Date(),
  };

  if (!prisma) {
    const mem = { ...record, createdAt: new Date() };
    fallback.set(record.decisionId, mem);
    return mapDecision(mem);
  }

  const created = await prisma.decisionLog.create({ data: record });
  return mapDecision(created);
};

export const getDecisionLogById = async (decisionId) => {
  const prisma = await getPrismaClient();
  if (!prisma) {
    const record = fallback.get(decisionId);
    return record ? mapDecision(record) : null;
  }

  const record = await prisma.decisionLog.findUnique({ where: { decisionId } });
  return record ? mapDecision(record) : null;
};

export const listDecisionLogs = async ({ limit = 20 } = {}) => {
  const prisma = await getPrismaClient();
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  if (!prisma) {
    return [...fallback.values()]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, safeLimit)
      .map(mapDecision);
  }

  const rows = await prisma.decisionLog.findMany({ orderBy: { createdAt: 'desc' }, take: safeLimit });
  return rows.map(mapDecision);
};


export const __resetDecisionLogRepositoryForTests = () => { fallback.clear(); };
