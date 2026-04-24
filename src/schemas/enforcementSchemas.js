export const createRecordSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['recipient', 'title', 'issuer', 'issueDate'],
  properties: {
    qrvid: { type: 'string', pattern: '^QRV-[A-Z0-9-]{6,64}$' },
    recipient: { type: 'string', minLength: 1, maxLength: 256 },
    title: { type: 'string', minLength: 1, maxLength: 256 },
    subject: { type: 'string', minLength: 1, maxLength: 256 },
    description: { type: 'string', minLength: 0, maxLength: 1024 },
    issuer: { type: 'string', minLength: 1, maxLength: 128 },
    issueDate: { type: 'string', format: 'date-time' },
    expirationDate: { type: 'string', format: 'date-time' },
    metadata: { type: 'object' },
  },
};

export const revokeRecordSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['revoked_at_utc', 'reason'],
  properties: {
    revoked_at_utc: { type: 'string', format: 'date-time' },
    reason: { type: 'string', minLength: 3, maxLength: 500 },
  },
};

export const verifyResponseSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['qrvid', 'verificationState', 'recordType', 'signatureValid', 'source', 'checkedAt', 'status'],
  properties: {
    qrvid: { type: 'string' },
    verificationState: { enum: ['VERIFIED', 'REVOKED', 'EXPIRED', 'NOT_FOUND', 'INVALID_FORMAT', 'INVALID_SIGNATURE', 'UNAVAILABLE'] },
    status: { enum: ['VERIFIED', 'REVOKED', 'EXPIRED', 'NOT_FOUND', 'INVALID_FORMAT', 'INVALID_SIGNATURE', 'UNAVAILABLE'] },
    recordType: { type: 'string' },
    issuer: { type: ['string', 'null'] },
    recipient: { type: ['string', 'null'] },
    title: { type: ['string', 'null'] },
    issuedAt: { type: ['string', 'null'], format: 'date-time' },
    expiresAt: { type: ['string', 'null'], format: 'date-time' },
    hash: { type: ['string', 'null'] },
    signatureValid: { type: 'boolean' },
    canonicalUrl: { type: 'string' },
    apiUrl: { type: 'string' },
    source: { type: 'string' },
    checkedAt: { type: 'string', format: 'date-time' },
  },
};

export const errorResponseSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['error', 'code', 'details', 'timestamp_utc'],
  properties: {
    error: { type: 'string' },
    code: { type: 'string' },
    details: { type: 'array', items: { type: 'string' } },
    timestamp_utc: { type: 'string', format: 'date-time' },
  },
};

export const taskSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['task_id', 'task_type', 'created_at_utc', 'input'],
  properties: {
    task_id: { type: 'string', minLength: 1 },
    task_type: { type: 'string', minLength: 1 },
    created_at_utc: { type: 'string', format: 'date-time' },
    input: { type: 'object' },
  },
};

export const workflowSpecSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['workflow_id', 'workflow_version', 'tasks'],
  properties: {
    workflow_id: { type: 'string', minLength: 1 },
    workflow_version: { type: 'string', minLength: 1 },
    tasks: { type: 'array', minItems: 1, items: taskSchema },
  },
};

export const policyDecisionSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['decision', 'reason', 'obligations', 'evaluated_at_utc'],
  properties: {
    decision: { enum: ['allow', 'deny', 'escalate'] },
    reason: { type: 'string', minLength: 1 },
    obligations: { type: 'array', items: { type: 'string' } },
    evaluated_at_utc: { type: 'string', format: 'date-time' },
  },
};

export const auditEventSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['event_id', 'event_type', 'actor', 'occurred_at_utc', 'recorded_at_utc', 'decision'],
  properties: {
    event_id: { type: 'string', minLength: 1 },
    event_type: { type: 'string', minLength: 1 },
    actor: { type: 'string', minLength: 1 },
    target: { type: ['string', 'null'] },
    occurred_at_utc: { type: 'string', format: 'date-time' },
    recorded_at_utc: { type: 'string', format: 'date-time' },
    decision: policyDecisionSchema,
  },
};
