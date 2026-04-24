import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { resetAccDb } from '../src/services/accDb.js';

let server;
let baseUrl;

const jsonRequest = async ({ method, path, body }) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
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

test('POST /api/v1/agents/profile returns 400 on schema validation errors', async () => {
  const response = await jsonRequest({
    method: 'POST',
    path: '/api/v1/agents/profile',
    body: {
      agent_id: 'bad profile id with spaces',
      display_name: '',
    },
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.code, 'INVALID_REQUEST');
  assert.ok(Array.isArray(response.body.details));
  assert.ok(response.body.details.length > 0);
});

test('POST /api/v1/agents/profile saves valid profiles to acc-db and GET fetches by id', async () => {
  const profilePayload = {
    agent_id: 'agent_123',
    display_name: 'Support Agent',
    description: 'Customer support specialist',
    context_window_tokens: 128000,
    capabilities: ['triage', 'summarization'],
    metadata: {
      tier: 'gold',
      active: true,
    },
  };

  const createResponse = await jsonRequest({
    method: 'POST',
    path: '/api/v1/agents/profile',
    body: profilePayload,
  });

  assert.equal(createResponse.status, 201);
  assert.equal(createResponse.body.id, profilePayload.agent_id);
  assert.equal(createResponse.body.display_name, profilePayload.display_name);

  const getResponse = await jsonRequest({
    method: 'GET',
    path: `/api/v1/agents/profile/${profilePayload.agent_id}`,
  });

  assert.equal(getResponse.status, 200);
  assert.equal(getResponse.body.id, profilePayload.agent_id);
  assert.deepEqual(getResponse.body.capabilities, profilePayload.capabilities);
});

test('GET /api/v1/agents/profile/:id returns 404 for unknown profile id', async () => {
  const response = await jsonRequest({
    method: 'GET',
    path: '/api/v1/agents/profile/not-found-agent',
  });

  assert.equal(response.status, 404);
  assert.equal(response.body.code, 'NOT_FOUND');
});
