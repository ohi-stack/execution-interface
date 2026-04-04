import crypto from 'node:crypto';
import { validators } from './schemaRegistry.js';

const auditEvents = [];

export const logAuditEvent = ({ event_type, actor, target, decision }) => {
  const now = new Date().toISOString();
  const event = {
    event_id: crypto.randomUUID(),
    event_type,
    actor,
    target,
    occurred_at_utc: now,
    recorded_at_utc: now,
    decision,
  };

  const validation = validators.auditEvent(event);
  if (!validation.isValid) {
    throw new Error(`Audit event validation failed: ${validation.errors.join('; ')}`);
  }

  auditEvents.push(event);
  return event;
};

export const getAuditEvents = () => [...auditEvents];
