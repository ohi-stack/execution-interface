import { randomUUID } from 'node:crypto';
import { successResponse } from '../utils/response.js';

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

  const data = {
    executionId,
    status: 'pending',
    traceId,
    envelope: {
      request: normalizedRequest,
      execution: {
        executionId,
        status: 'pending',
      },
    },
  };

  return {
    statusCode: 200,
    response: successResponse(data, {
      requestId: traceId,
      traceId,
      timestamp,
      service: 'execution-interface',
      version: 'v1',
    }),
  };
};
