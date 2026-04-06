import { randomUUID } from 'node:crypto';

const normalizeInput = (payload) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return {};
  }

  return payload;
};

export const createExecutionEnvelope = (payload) => {
  const executionId = `exec_${randomUUID()}`;
  const traceId = `trace_${randomUUID()}`;
  const receivedAtUtc = new Date().toISOString();

  return {
    statusCode: 202,
    response: {
      status: 'accepted',
      trace_id: traceId,
      execution: {
        execution_id: executionId,
        state: 'queued',
      },
      envelope: {
        version: 'v1',
        type: 'execution.response',
        received_at_utc: receivedAtUtc,
        request: normalizeInput(payload),
      },
    },
  };
};
