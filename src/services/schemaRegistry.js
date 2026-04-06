const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);
const isUtcDate = (value) => typeof value === 'string' && /Z$/.test(value) && !Number.isNaN(new Date(value).getTime());

const createRecord = (payload) => {
  const errors = [];
  if (!isObject(payload)) errors.push('body must be an object');
  const allowed = ['qrvid', 'issuer', 'subject', 'issued_at_utc', 'expires_at_utc', 'metadata_hash'];
  for (const key of Object.keys(payload || {})) if (!allowed.includes(key)) errors.push(`unexpected property ${key}`);
  if (!/^QRV-[A-Z0-9-]{6,64}$/.test(payload?.qrvid || '')) errors.push('qrvid must match QRV pattern');
  if (!payload?.issuer) errors.push('issuer is required');
  if (!payload?.subject) errors.push('subject is required');
  if (!isUtcDate(payload?.issued_at_utc)) errors.push('issued_at_utc must be UTC date-time');
  if (payload?.expires_at_utc && !isUtcDate(payload.expires_at_utc)) errors.push('expires_at_utc must be UTC date-time');
  if (!/^[A-Fa-f0-9]{32,128}$/.test(payload?.metadata_hash || '')) errors.push('metadata_hash must be hex string');
  return { isValid: errors.length === 0, errors };
};

const revokeRecord = (payload) => {
  const errors = [];
  if (!isObject(payload)) errors.push('body must be an object');
  const allowed = ['revoked_at_utc', 'reason'];
  for (const key of Object.keys(payload || {})) if (!allowed.includes(key)) errors.push(`unexpected property ${key}`);
  if (!isUtcDate(payload?.revoked_at_utc)) errors.push('revoked_at_utc must be UTC date-time');
  if (!payload?.reason || payload.reason.length < 3) errors.push('reason must be at least 3 chars');
  return { isValid: errors.length === 0, errors };
};


const executeRequest = (payload) => {
  const errors = [];
  if (!isObject(payload)) errors.push('body must be an object');
  const allowed = ['workflow'];
  for (const key of Object.keys(payload || {})) if (!allowed.includes(key)) errors.push(`unexpected property ${key}`);
  if (!payload?.workflow || typeof payload.workflow !== 'string') errors.push('workflow is required');
  return { isValid: errors.length === 0, errors };
};

const verifyResponse = (payload) => {
  const validStatuses = new Set(['VERIFIED', 'REVOKED', 'EXPIRED', 'NOT_FOUND']);
  const errors = [];
  if (!isObject(payload)) errors.push('payload must be object');
  if (!payload?.qrvid) errors.push('qrvid required');
  if (!validStatuses.has(payload?.status)) errors.push('status invalid');
  if (!isUtcDate(payload?.checked_at_utc)) errors.push('checked_at_utc must be UTC date-time');
  return { isValid: errors.length === 0, errors };
};

const policyDecision = (payload) => {
  const errors = [];
  if (!['allow', 'deny', 'escalate'].includes(payload?.decision)) errors.push('decision invalid');
  if (!payload?.reason) errors.push('reason required');
  if (!Array.isArray(payload?.obligations)) errors.push('obligations must be array');
  if (!isUtcDate(payload?.evaluated_at_utc)) errors.push('evaluated_at_utc must be UTC date-time');
  return { isValid: errors.length === 0, errors };
};

const auditEvent = (payload) => {
  const errors = [];
  if (!payload?.event_id) errors.push('event_id required');
  if (!payload?.event_type) errors.push('event_type required');
  if (!payload?.actor) errors.push('actor required');
  if (!isUtcDate(payload?.occurred_at_utc)) errors.push('occurred_at_utc must be UTC date-time');
  if (!isUtcDate(payload?.recorded_at_utc)) errors.push('recorded_at_utc must be UTC date-time');
  const decisionValidation = policyDecision(payload?.decision || {});
  if (!decisionValidation.isValid) errors.push(...decisionValidation.errors.map((error) => `decision.${error}`));
  return { isValid: errors.length === 0, errors };
};

const errorResponse = (payload) => {
  const errors = [];
  if (!payload?.error) errors.push('error required');
  if (!payload?.code) errors.push('code required');
  if (!Array.isArray(payload?.details)) errors.push('details must be array');
  if (!isUtcDate(payload?.timestamp_utc)) errors.push('timestamp_utc must be UTC date-time');
  return { isValid: errors.length === 0, errors };
};

const task = (payload) => {
  const errors = [];
  if (!payload?.task_id) errors.push('task_id required');
  if (!payload?.task_type) errors.push('task_type required');
  if (!isUtcDate(payload?.created_at_utc)) errors.push('created_at_utc must be UTC date-time');
  if (!isObject(payload?.input)) errors.push('input must be object');
  return { isValid: errors.length === 0, errors };
};

const workflow = (payload) => {
  const errors = [];
  if (!payload?.workflow_id) errors.push('workflow_id required');
  if (!payload?.workflow_version) errors.push('workflow_version required');
  if (!Array.isArray(payload?.tasks) || payload.tasks.length === 0) {
    errors.push('tasks must be a non-empty array');
  } else {
    payload.tasks.forEach((entry, index) => {
      const validation = task(entry);
      if (!validation.isValid) errors.push(...validation.errors.map((error) => `tasks[${index}].${error}`));
    });
  }
  return { isValid: errors.length === 0, errors };
};

export const validators = {
  createRecord,
  revokeRecord,
  executeRequest,
  verifyResponse,
  policyDecision,
  auditEvent,
  task,
  workflow,
  errorResponse,
};
