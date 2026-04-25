import { createRecord, provisionApiKey, provisionIssuer, revokeRecord, verifyRecord } from '../../services/recordStore.js';
import { logAuditEvent } from '../../services/auditLogService.js';
import {
  getAgentProfileById,
  saveAgentProfile,
  saveAuthorityPolicy,
  saveTask,
  saveWorkflow,
} from '../../services/accDb.js';

const actorRole = (req) => req.actorRole || req.header('x-actor-role') || req.jwt?.role || 'anonymous';

export const postRecord = async (req, res) => {
  const result = await createRecord(req.body);

  logAuditEvent({
    event_type: 'record.create',
    actor: actorRole(req),
    target: req.body.qrvid,
    decision: req.policyDecision,
  });

  if (!result.ok) return res.status(result.statusCode).json(result.error);
  return res.status(201).json(result.record);
};

export const postRevokeRecord = async (req, res) => {
  const qrvid = req.params.qrvid;
  const result = await revokeRecord(qrvid, req.body);

  logAuditEvent({
    event_type: 'record.revoke',
    actor: actorRole(req),
    target: qrvid,
    decision: req.policyDecision,
  });

  if (!result.ok) return res.status(result.statusCode).json(result.error);
  return res.status(200).json(result.record);
};

export const postRevokeRecordByBody = async (req, res) => {
  const { qrvid, ...revokePayload } = req.body;
  const result = await revokeRecord(qrvid, revokePayload);

  logAuditEvent({
    event_type: 'record.revoke',
    actor: actorRole(req),
    target: qrvid,
    decision: req.policyDecision,
  });

  if (!result.ok) return res.status(result.statusCode).json(result.error);
  return res.status(200).json(result.record);
};

export const getVerifyRecord = async (req, res) => {
  const result = await verifyRecord(req.params.qrvid);
  if (!result.ok) return res.status(result.statusCode).json(result.error);
  return res.status(result.statusCode).json(result.verification);
};

export const postIssuerProvision = async (req, res) => {
  const issuer = await provisionIssuer(req.body);
  return res.status(201).json(issuer);
};

export const postApiKeyProvision = async (req, res) => {
  const key = await provisionApiKey(req.body);
  return res.status(201).json(key);
};

export const postAgentProfile = (req, res) => {
  const profile = saveAgentProfile(req.body);
  logAuditEvent({ event_type: 'agent.profile.save', actor: actorRole(req), target: profile.id, decision: req.policyDecision });
  return res.status(201).json(profile);
};

export const getAgentProfile = (req, res) => {
  const profile = getAgentProfileById(req.params.id);
  if (!profile) {
    return res.status(404).json({ error: 'Agent profile not found', code: 'NOT_FOUND', details: [`agent profile ${req.params.id} does not exist`], timestamp_utc: new Date().toISOString() });
  }
  return res.status(200).json(profile);
};

export const postTask = (req, res) => res.status(201).json(saveTask(req.body));
export const postWorkflow = (req, res) => res.status(201).json(saveWorkflow(req.body));
export const postAuthorityPolicy = (req, res) => res.status(201).json(saveAuthorityPolicy(req.body));
