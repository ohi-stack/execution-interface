import { createRecord, getRecord, listRecords, revokeRecord, seedDemoRecord, verifyRecord } from '../../services/recordStore.js';
import { logAuditEvent } from '../../services/auditLogService.js';

const actorRole = (req) => req.header('x-actor-role') || 'anonymous';
const nowUtc = () => new Date().toISOString();

const revokeByQrvid = ({ qrvid, revokePayload, actor, decision }) => {
  const result = revokeRecord(qrvid, revokePayload);

  logAuditEvent({
    event_type: 'record.revoke',
    actor,
    target: qrvid,
    decision,
  });

  return result;
};

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
  const result = revokeByQrvid({
    qrvid,
    revokePayload: req.body,
    actor: actorRole(req),
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

  logAuditEvent({
    event_type: 'record.verify',
    actor: actorRole(req),
    target: qrvid,
    decision: {
      decision: 'allow',
      reason: 'public verification',
      obligations: [],
      evaluated_at_utc: nowUtc(),
    },
  });

  if (!result.ok) {
    return res.status(result.statusCode).json(result.error);
  }

  return res.status(result.statusCode).json(result.verification);
};

export const postRegistryCreate = postRecord;

export const postRevoke = (req, res) => {
  const qrvid = req.body?.qrvid;
  if (!qrvid) {
    return res.status(400).json({
      error: 'Invalid request',
      code: 'INVALID_REQUEST',
      details: ['qrvid is required in request body'],
      timestamp_utc: nowUtc(),
    });
  }

  const result = revokeByQrvid({
    qrvid,
    revokePayload: req.body,
    actor: actorRole(req),
    decision: req.policyDecision,
  });

  if (!result.ok) {
    return res.status(result.statusCode).json(result.error);
  }

  return res.status(200).json(result.record);
};

export const getRegistryRecord = (req, res) => {
  const record = getRecord(req.params.qrvid);

  if (!record) {
    return res.status(404).json({
      error: 'Record not found',
      code: 'NOT_FOUND',
      details: [`qrvid ${req.params.qrvid} does not exist`],
      timestamp_utc: nowUtc(),
    });
  }

  return res.status(200).json(record);
};

export const getRegistryRecords = (_req, res) => {
  return res.status(200).json({
    records: listRecords(),
  });
};

export const postSeedDemo = (_req, res) => {
  const record = seedDemoRecord();
  return res.status(201).json({
    seeded: true,
    record,
  });
};
