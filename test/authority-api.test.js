import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { __resetDecisionLogRepositoryForTests } from '../src/services/decisionLogRepository.js';
import { __resetKillSwitchForTests } from '../src/services/killSwitchService.js';

let server;
let baseUrl;

const jsonRequest = async ({ method, path, body }) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch {}

  return { status: response.status, body: payload };
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
  __resetDecisionLogRepositoryForTests();
  __resetKillSwitchForTests();
});

test('creates persistent decision record and retrieves it after authorize request', async () => {
  const auth = await jsonRequest({
    method: 'POST',
    path: '/api/v1/authorize',
    body: { action: 'create_record', role: 'admin', actorId: 'u-1', actorType: 'user', environment: 'ops', authorityScope: { permissions: ['create_record'] } },
  });

  assert.equal(auth.status, 200);
  assert.equal(typeof auth.body.decisionId, 'string');

  const fetched = await jsonRequest({ method: 'GET', path: `/api/v1/decisions/${auth.body.decisionId}` });
  assert.equal(fetched.status, 200);
  assert.equal(fetched.body.action, 'create_record');
  assert.equal(fetched.body.decision, 'allow');
});

test('kill switch denies affected privileged execution', async () => {
  const enabled = await jsonRequest({ method: 'POST', path: '/api/v1/kill-switch/domain/ops', body: { active: true, reason: 'incident' } });
  assert.equal(enabled.status, 200);
  assert.equal(enabled.body.domains.ops, true);

  const denied = await jsonRequest({
    method: 'POST',
    path: '/api/v1/authorize',
    body: { action: 'create_record', role: 'admin', actorId: 'u-1', actorType: 'user', environment: 'ops' },
  });

  assert.equal(denied.status, 403);
  assert.equal(denied.body.decision, 'deny');
  assert.match(denied.body.reason, /Kill switch active/i);
});

test('approval-required action and prohibited action are logged', async () => {
  const approval = await jsonRequest({
    method: 'POST',
    path: '/api/v1/authorize',
    body: { action: 'unknown_privileged_action', role: 'admin', actorId: 'u-2', actorType: 'user', environment: 'ops' },
  });

  assert.equal(approval.status, 403);

  const prohibited = await jsonRequest({
    method: 'POST',
    path: '/api/v1/authorize',
    body: { action: 'create_record', role: 'anonymous', actorId: 'u-3', actorType: 'user', environment: 'ops' },
  });

  assert.equal(prohibited.status, 403);

  const list = await jsonRequest({ method: 'GET', path: '/api/v1/decisions?limit=10' });
  assert.equal(list.status, 200);
  assert.ok(list.body.decisions.length >= 2);
  assert.ok(list.body.decisions.some((d) => d.reason.includes('No policy rule')));
  assert.ok(list.body.decisions.some((d) => d.reason.includes('not authorized')));
});
