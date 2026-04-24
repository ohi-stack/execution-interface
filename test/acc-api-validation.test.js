import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { resetAccDb } from '../src/services/accDb.js';

let server;
let baseUrl;

const jsonRequest = async ({ method, path, body, headers = {} }) => {
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
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test.beforeEach(() => {
  resetAccDb();
});

test('POST /api/v1/tasks validates against task.schema.json', async () => {
  const bad = await jsonRequest({
    method: 'POST',
    path: '/api/v1/tasks',
    body: { task_id: 't-1' },
  });

  assert.equal(bad.status, 400);
  assert.equal(bad.body.code, 'INVALID_REQUEST');

  const good = await jsonRequest({
    method: 'POST',
    path: '/api/v1/tasks',
    body: {
      task_id: 't-1',
      task_type: 'classification',
      created_at_utc: '2026-04-01T00:00:00Z',
      input: { prompt: 'hello' },
    },
  });

  assert.equal(good.status, 201);
  assert.equal(good.body.task_id, 't-1');
});

test('POST /api/v1/workflows validates against workflow.schema.json', async () => {
  const bad = await jsonRequest({
    method: 'POST',
    path: '/api/v1/workflows',
    body: {
      workflow_id: 'wf-1',
      workflow_version: '1.0.0',
      tasks: [],
    },
  });

  assert.equal(bad.status, 400);
  assert.equal(bad.body.code, 'INVALID_REQUEST');

  const good = await jsonRequest({
    method: 'POST',
    path: '/api/v1/workflows',
    body: {
      workflow_id: 'wf-1',
      workflow_version: '1.0.0',
      tasks: [
        {
          task_id: 't-2',
          task_type: 'alignment',
          created_at_utc: '2026-04-01T00:00:00Z',
          input: { channel: 'api' },
        },
      ],
    },
  });

  assert.equal(good.status, 201);
  assert.equal(good.body.workflow_id, 'wf-1');
});

test('POST /api/v1/policies validates against authority-policy.schema.json', async () => {
  const bad = await jsonRequest({
    method: 'POST',
    path: '/api/v1/policies',
    body: {
      policy_id: 'pol-1',
      authority: 'ops',
      rules: [],
    },
  });

  assert.equal(bad.status, 400);
  assert.equal(bad.body.code, 'INVALID_REQUEST');

  const good = await jsonRequest({
    method: 'POST',
    path: '/api/v1/policies',
    body: {
      policy_id: 'pol-1',
      authority: 'ops',
      rules: ['log_audit_event'],
      updated_at_utc: '2026-04-01T00:00:00Z',
    },
  });

  assert.equal(good.status, 201);
  assert.equal(good.body.policy_id, 'pol-1');
});

test('POST /api/v1/agents/profile validates against agent-context-profile.schema.json', async () => {
  const bad = await jsonRequest({
    method: 'POST',
    path: '/api/v1/agents/profile',
    body: {
      agent_id: 'bad profile id',
      display_name: '',
      capabilities: [],
      context_window_tokens: 0,
    },
  });

  assert.equal(bad.status, 400);
  assert.equal(bad.body.code, 'INVALID_REQUEST');

  const good = await jsonRequest({
    method: 'POST',
    path: '/api/v1/agents/profile',
    headers: { 'x-actor-role': 'admin' },
    body: {
      agent_id: 'agent_abc',
      display_name: 'Agent ABC',
      context_window_tokens: 16000,
      capabilities: ['analysis'],
    },
  });

  assert.equal(good.status, 201);
  assert.equal(good.body.id, 'agent_abc');
});
