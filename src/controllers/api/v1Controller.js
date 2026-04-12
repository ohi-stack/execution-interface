import { createRecord, revokeRecord, verifyRecord } from '../../services/recordStore.js';
import { logAuditEvent } from '../../services/auditLogService.js';
import {
  createHistoricalEvent,
  getHistoricalEvent,
  listHistoricalEvents,
  migrateLegacyHistoricalRecord,
} from '../../services/historicalEventArchive.js';

const actorRole = (req) => req.header('x-actor-role') || 'anonymous';

export const postRecord = async (req, res) => {
  try {
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

    await createHistoricalEvent({
      title: 'Record issued',
      description: `Verification record ${result.record.qrvid} issued by ${result.record.issuer}`,
      timestamp_utc: result.record.issued_at_utc,
      timezone: 'UTC',
      source_authority: 'onegodian-api',
      version_standard: 'onegodian-canonical/v1',
    });

    return res.status(201).json(result.record);
  } catch (error) {
    return res.status(500).json({
      error: 'Historical event archiving failed',
      code: 'ARCHIVE_FAILURE',
      details: [error.message],
      timestamp_utc: new Date().toISOString(),
    });
  }
};

export const postRevokeRecord = async (req, res) => {
  try {
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

    await createHistoricalEvent({
      title: 'Record revoked',
      description: `Verification record ${qrvid} revoked: ${req.body.reason}`,
      timestamp_utc: req.body.revoked_at_utc,
      timezone: 'UTC',
      source_authority: 'onegodian-api',
      version_standard: 'onegodian-canonical/v1',
    });

    return res.status(200).json(result.record);
  } catch (error) {
    return res.status(500).json({
      error: 'Historical event archiving failed',
      code: 'ARCHIVE_FAILURE',
      details: [error.message],
      timestamp_utc: new Date().toISOString(),
    });
  }
};

export const getVerifyRecord = (req, res) => {
  const qrvid = req.params.qrvid;
  const result = verifyRecord(qrvid);

  if (!result.ok) {
    return res.status(result.statusCode).json(result.error);
  }

  return res.status(result.statusCode).json(result.verification);
};

export const postHistoricalEvent = async (req, res) => {
  try {
    const result = await createHistoricalEvent(req.body);
    if (!result.ok) {
      return res.status(result.statusCode).json(result.error);
    }

    return res.status(result.statusCode).json(result.event);
  } catch (error) {
    if (/mismatch|must be/.test(error.message)) {
      return res.status(400).json({
        error: 'Historical event validation failed',
        code: 'HISTORICAL_EVENT_INVALID',
        details: [error.message],
        timestamp_utc: new Date().toISOString(),
      });
    }

    return res.status(500).json({
      error: 'Historical event archiving failed',
      code: 'ARCHIVE_FAILURE',
      details: [error.message],
      timestamp_utc: new Date().toISOString(),
    });
  }
};

export const postMigrateHistoricalEvent = async (req, res) => {
  try {
    const result = await migrateLegacyHistoricalRecord(req.body);
    if (!result.ok) {
      return res.status(result.statusCode).json(result.error);
    }

    return res.status(result.statusCode).json(result.event);
  } catch (error) {
    if (/mismatch|must be/.test(error.message)) {
      return res.status(400).json({
        error: 'Legacy migration validation failed',
        code: 'MIGRATION_INVALID',
        details: [error.message],
        timestamp_utc: new Date().toISOString(),
      });
    }

    return res.status(500).json({
      error: 'Legacy migration failed',
      code: 'MIGRATION_FAILURE',
      details: [error.message],
      timestamp_utc: new Date().toISOString(),
    });
  }
};

export const getHistoricalEvents = (_req, res) => res.status(200).json({ events: listHistoricalEvents() });

export const getHistoricalEventById = (req, res) => {
  const event = getHistoricalEvent(req.params.event_id);
  if (!event) {
    return res.status(404).json({
      error: 'Historical event not found',
      code: 'EVENT_NOT_FOUND',
      details: [`event_id ${req.params.event_id} does not exist`],
      timestamp_utc: new Date().toISOString(),
    });
  }

  return res.status(200).json(event);
};
