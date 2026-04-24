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
    console.error(`[audit] validation failed: ${validation.errors.join('; ')}`);
    return null;
  }

  try {
    auditEvents.push(event);
  } catch (error) {
    console.error('[audit] failed to persist audit event', error);
    return null;
  }
  return event;
};

export const getAuditEvents = () => [...auditEvents];
