import crypto from 'node:crypto';
import { evaluatePolicy } from './policyService.js';
import { logAuditEvent } from './auditLogService.js';

const executionRecords = new Map();

const nowUtc = () => new Date().toISOString();

const buildEnvelope = ({ success, data = null, error = null }) => ({
  success,
  data,
  error,
  meta: {
    timestamp: nowUtc(),
    service: 'execution-interface',
    version: 'v1',
  },
});

const parseIdentity = (req) => {
  const userId = req.header('x-user-id') || null;
  const roles = (req.header('x-roles') || req.header('x-actor-role') || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
  const permissions = (req.header('x-permissions') || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (!userId || roles.length === 0) {
    return {
      ok: false,
      envelope: buildEnvelope({
        success: false,
        error: {
          code: 'IDENTITY_REQUIRED',
          message: 'Missing identity context',
          details: ['x-user-id and x-roles headers are required'],
        },
      }),
    };
  }

  return {
    ok: true,
    actor: { userId, roles, permissions },
  };
};

const evaluateExecutionPolicy = ({ actor, action }) => {
  const role = actor.roles[0] || 'anonymous';
  const policyDecision = evaluatePolicy({ action, actorRole: role });

  if (policyDecision.decision !== 'allow') {
    return {
      approved: false,
      policyDecision,
      envelope: buildEnvelope({
        success: false,
        error: {
          code: 'POLICY_DENY',
          message: 'Execution blocked by policy',
          details: [policyDecision.reason],
        },
      }),
    };
  }

  return {
    approved: true,
    policyDecision,
    approvalId: crypto.randomUUID(),
  };
};

export const executeWorkflow = ({ req, workflow }) => {
  const identity = parseIdentity(req);
  if (!identity.ok) {
    return { statusCode: 401, envelope: identity.envelope };
  }

  const policy = evaluateExecutionPolicy({ actor: identity.actor, action: 'execute_workflow' });
  if (!policy.approved) {
    return { statusCode: 403, envelope: policy.envelope };
  }

  const executionId = crypto.randomUUID();
  const timestamp = nowUtc();

  const record = {
    executionId,
    approvalId: policy.approvalId,
    workflow,
    actor: identity.actor,
    status: 'pending',
    result: null,
    decision: 'approved',
    policyVersion: 'v1',
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  executionRecords.set(executionId, record);

  logAuditEvent({
    event_type: 'execution.approve',
    actor: identity.actor.userId,
    target: executionId,
    decision: policy.policyDecision,
  });

  return {
    statusCode: 202,
    envelope: buildEnvelope({
      success: true,
      data: {
        executionId,
        status: 'pending',
        workflow,
        result: null,
      },
      error: null,
    }),
  };
};

export const getExecution = ({ executionId }) => {
  const record = executionRecords.get(executionId);

  if (!record) {
    return {
      statusCode: 404,
      envelope: buildEnvelope({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Execution not found',
          details: [`executionId ${executionId} does not exist`],
        },
      }),
    };
  }

  return {
    statusCode: 200,
    envelope: buildEnvelope({
      success: true,
      data: {
        executionId: record.executionId,
        approvalId: record.approvalId,
        actor: record.actor,
        status: record.status,
        workflow: record.workflow,
        result: record.result,
        decision: record.decision,
        policyVersion: record.policyVersion,
        timestamps: {
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        },
        auditReference: {
          eventType: 'execution.approve',
          target: record.executionId,
        },
      },
      error: null,
    }),
  };
};

export const resetExecutionStore = () => {
  executionRecords.clear();
};
