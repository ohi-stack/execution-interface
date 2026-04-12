export const createRecordSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['qrvid', 'issuer', 'subject', 'issued_at_utc', 'metadata_hash'],
  properties: {
    qrvid: { type: 'string', pattern: '^QRV-[A-Z0-9-]{6,64}$' },
    issuer: { type: 'string', minLength: 1, maxLength: 128 },
    subject: { type: 'string', minLength: 1, maxLength: 256 },
    issued_at_utc: { type: 'string', format: 'date-time' },
    expires_at_utc: { type: 'string', format: 'date-time' },
    metadata_hash: { type: 'string', pattern: '^[A-Fa-f0-9]{32,128}$' },
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
  required: ['qrvid', 'status', 'checked_at_utc'],
  properties: {
    qrvid: { type: 'string' },
    status: { enum: ['VERIFIED', 'REVOKED', 'EXPIRED', 'NOT_FOUND'] },
    issuer: { type: ['string', 'null'] },
    subject: { type: ['string', 'null'] },
    issued_at_utc: { type: ['string', 'null'], format: 'date-time' },
    expires_at_utc: { type: ['string', 'null'], format: 'date-time' },
    revoked_at_utc: { type: ['string', 'null'], format: 'date-time' },
    metadata_hash: { type: ['string', 'null'] },
    checked_at_utc: { type: 'string', format: 'date-time' },
    message: { type: 'string' },
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

export const historicalEventSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'event_id',
    'title',
    'description',
    'timestamp_utc',
    'timestamp_local',
    'timezone',
    'gregorian_date',
    'gregorian_weekday',
    'ot_year',
    'ot_month_name',
    'ot_day',
    'ot_day_order_name',
    'source_authority',
    'version_standard',
  ],
  properties: {
    event_id: { type: 'string', minLength: 32, maxLength: 128 },
    title: { type: 'string', minLength: 1, maxLength: 200 },
    description: { type: 'string', minLength: 1, maxLength: 2000 },
    timestamp_utc: { type: 'string', format: 'date-time' },
    timestamp_local: { type: 'string', minLength: 10, maxLength: 32 },
    timezone: { type: 'string', minLength: 1, maxLength: 100 },
    gregorian_date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
    gregorian_weekday: { type: 'string', minLength: 3, maxLength: 12 },
    ot_year: { type: 'integer' },
    ot_month_name: { type: 'string', minLength: 1, maxLength: 64 },
    ot_day: { type: 'integer', minimum: 1, maximum: 366 },
    ot_day_order_name: { type: 'string', minLength: 1, maxLength: 64 },
    source_authority: { type: 'string', minLength: 1, maxLength: 128 },
    version_standard: { type: 'string', minLength: 1, maxLength: 128 },
  },
};
