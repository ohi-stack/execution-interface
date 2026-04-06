import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { resetExecutionStore } from '../src/services/executionService.js';

let server;
let baseUrl;

const jsonRequest = async ({ method, path, headers = {}, body }) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return {
    status: response.status,
    body: await response.json(),
  };
};

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test.beforeEach(() => {
  resetExecutionStore();
});

test('POST /v1/execute returns governed envelope format', async () => {
  const response = await jsonRequest({
    method: 'POST',
    path: '/v1/execute',
    headers: {
      'x-user-id': 'user-123',
      'x-roles': 'admin',
    },
    body: {
      workflow: 'issuer_onboarding',
    },
  });

  assert.equal(response.status, 202);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.status, 'pending');
  assert.equal(response.body.data.workflow, 'issuer_onboarding');
  assert.equal(response.body.data.result, null);
  assert.equal(typeof response.body.data.executionId, 'string');
  assert.equal(response.body.error, null);
  assert.equal(response.body.meta.service, 'execution-interface');
  assert.equal(response.body.meta.version, 'v1');
  assert.equal(typeof response.body.meta.timestamp, 'string');
});

test('GET /v1/executions/:id returns full execution object', async () => {
  const created = await jsonRequest({
    method: 'POST',
    path: '/v1/execute',
    headers: {
      'x-user-id': 'user-123',
      'x-roles': 'admin',
    },
    body: {
      workflow: 'payments_settlement',
    },
  });

  const executionId = created.body.data.executionId;
  const fetched = await jsonRequest({
    method: 'GET',
    path: `/v1/executions/${executionId}`,
  });

  assert.equal(fetched.status, 200);
  assert.equal(fetched.body.success, true);
  assert.equal(fetched.body.data.executionId, executionId);
  assert.equal(fetched.body.data.status, 'pending');
  assert.equal(fetched.body.data.workflow, 'payments_settlement');
  assert.equal(fetched.body.data.result, null);
  assert.equal(fetched.body.data.auditReference.eventType, 'execution.approve');
});

test('POST /v1/execute blocks requests without identity', async () => {
  const response = await jsonRequest({
    method: 'POST',
    path: '/v1/execute',
    body: {
      workflow: 'issuer_onboarding',
    },
  });

  assert.equal(response.status, 401);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'IDENTITY_REQUIRED');
});
