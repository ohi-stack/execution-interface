import crypto from 'node:crypto';
import { evaluatePolicy } from '../../services/policyService.js';
import { createDecisionLog, getDecisionLogById, listDecisionLogs } from '../../services/decisionLogRepository.js';
import { getKillSwitchState, isKillSwitchActive, setAgentKillSwitch, setDomainKillSwitch, setGlobalKillSwitch } from '../../services/killSwitchService.js';

const hashValue = (value) => crypto.createHash('sha256').update(JSON.stringify(value ?? {})).digest('hex');
const policyHash = () => crypto.createHash('sha256').update(JSON.stringify({ policyVersion: 'v1' })).digest('hex');

export const getAuthorityModel = (_req, res) => {
  res.status(200).json({
    model: 'Agent Authority Model',
    deterministicDecisionRecords: true,
    fields: ['decisionId', 'authorityScope', 'policyHash', 'executionId', 'timestampUtc', 'approvalStatus'],
  });
};

export const postAuthorize = async (req, res) => {
  const body = req.body || {};
  const actorRole = body.role || req.header('x-actor-role') || 'anonymous';
  const policyDecision = evaluatePolicy({ action: body.action, actorRole });
  const killActive = await isKillSwitchActive({ domain: body.environment, agentId: body.agentId });

  const decision = killActive ? 'deny' : policyDecision.decision;
  const reason = killActive ? 'Kill switch active for requested scope' : policyDecision.reason;
  const approvalStatus = decision === 'allow' ? 'approved' : policyDecision.obligations?.includes('manual_review_required') ? 'required' : 'rejected';

  const record = await createDecisionLog({
    ...body,
    role: actorRole,
    decision,
    reason,
    approvalStatus,
    policyHash: policyHash(),
    input: body,
    output: { decision, reason, approvalStatus },
    timestampUtc: new Date().toISOString(),
    authorityScope: body.authorityScope || { role: actorRole, environment: body.environment || 'development' },
    requestId: req.header('x-request-id') || crypto.randomUUID(),
    riskLevel: body.riskLevel || 'medium',
    outputHash: hashValue({ decision, reason, approvalStatus }),
    inputHash: hashValue(body),
  });

  const status = decision === 'allow' ? 200 : 403;
  return res.status(status).json({ decisionId: record.decisionId, decision, reason, approvalStatus });
};

export const getDecisionById = async (req, res) => {
  const decision = await getDecisionLogById(req.params.decisionId);
  if (!decision) return res.status(404).json({ error: 'Decision not found', code: 'NOT_FOUND', timestamp_utc: new Date().toISOString() });
  return res.status(200).json(decision);
};

export const getDecisions = async (req, res) => {
  const decisions = await listDecisionLogs({ limit: req.query.limit });
  return res.status(200).json({ decisions });
};

export const getKillSwitch = async (_req, res) => res.status(200).json(await getKillSwitchState());

export const postKillSwitchGlobal = async (req, res) => {
  await setGlobalKillSwitch({ active: req.body?.active, reason: req.body?.reason });
  return res.status(200).json(await getKillSwitchState());
};

export const postKillSwitchDomain = async (req, res) => {
  await setDomainKillSwitch({ domain: req.params.domain, active: req.body?.active, reason: req.body?.reason });
  return res.status(200).json(await getKillSwitchState());
};

export const postKillSwitchAgent = async (req, res) => {
  await setAgentKillSwitch({ agentId: req.params.agentId, active: req.body?.active, reason: req.body?.reason });
  return res.status(200).json(await getKillSwitchState());
};
