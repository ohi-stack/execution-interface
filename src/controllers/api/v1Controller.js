import { createRecord, revokeRecord, verifyRecord } from '../../services/recordStore.js';
import { logAuditEvent } from '../../services/auditLogService.js';

const actorRole = (req) => req.auth?.role || req.header('x-actor-role') || 'anonymous';

export const postRecord = (req, res) => {
  const result = createRecord(req.body);

  logAuditEvent({
    event_type: 'record.create',
    actor: actorRole(req),
    target: req.body.qrvid,
    decision: req.policyDecision,
  });

  if (!result.ok) {
    return res.status(result.statusCode).json(result.error);
  }

  return res.status(201).json(result.record);
};

export const postRevokeRecord = (req, res) => {
  const qrvid = req.params.qrvid;
  const result = revokeRecord(qrvid, req.body);

  logAuditEvent({
    event_type: 'record.revoke',
    actor: actorRole(req),
    target: qrvid,
    decision: req.policyDecision,
  });

  if (!result.ok) {
    return res.status(result.statusCode).json(result.error);
  }

  return res.status(200).json(result.record);
};

export const getVerifyRecord = (req, res) => {
  const qrvid = req.params.qrvid;
  const result = verifyRecord(qrvid);

  if (!result.ok) {
    return res.status(result.statusCode).json(result.error);
  }

  return res.status(result.statusCode).json(result.verification);
};
