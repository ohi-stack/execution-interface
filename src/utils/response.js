import { randomUUID } from 'node:crypto';

export const buildMeta = ({
  service = 'execution-interface',
  version = 'v1',
  requestId = randomUUID(),
  traceId = requestId,
  timestamp = new Date().toISOString(),
} = {}) => ({
  requestId,
  traceId,
  timestamp,
  service,
  version,
});

export const successResponse = (data, meta = {}) => ({
  success: true,
  data,
  error: null,
  meta: buildMeta(meta),
});
