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
  const timestamp = new Date().toISOString();
  const normalizedRequest = normalizeInput(payload);

  return {
    statusCode: 200,
    response: {
      status: 'ok',
      traceId,
      executionId,
      trace_id: traceId,
      execution_id: executionId,
      envelope: {
        version: 'v1',
        type: 'execution',
        status: 'queued',
        timestamp,
        traceId,
        executionId,
        request: normalizedRequest,
      },
      execution: {
        state: 'queued',
        submittedAtUtc: timestamp,
      },
    },
  };
};
