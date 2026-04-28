import assert from 'node:assert/strict';
import test from 'node:test';

import request from 'supertest';

import app from '../src/app.js';
import { resetDecisionLog } from '../src/services/decisionLogRepository.js';

let createdDecisionIds = [];

test.beforeEach(() => {
  resetDecisionLog();
  createdDecisionIds = [];
});

test('GET /health', async () => {
  const response = await request(app).get('/health');
  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'ok');
});

test('GET /api/v1/authority/model', async () => {
  const response = await request(app).get('/api/v1/authority/model');

  assert.equal(response.status, 200);
  assert.equal(response.body.version, '0.1.0');
  assert.ok(response.body.actions.create_record);
});

test('POST /api/v1/authorize allowed action', async () => {
  const response = await request(app)
    .post('/api/v1/authorize')
    .set('x-request-id', 'req-allowed-001')
    .send({
      actorType: 'user',
      actorId: 'actor-001',
      role: 'admin',
      action: 'create_record',
    });

  assert.equal(response.status, 200);
  assert.equal(response.body.decision, 'allow');
  assert.equal(response.body.requestId, 'req-allowed-001');
  createdDecisionIds.push(response.body.decisionId);

  const decisionLookup = await request(app).get(`/api/v1/decisions/${response.body.decisionId}`);
  assert.equal(decisionLookup.status, 200);
  assert.equal(decisionLookup.body.decisionId, response.body.decisionId);
  assert.equal(decisionLookup.body.actorType, 'user');
});

test('POST /api/v1/authorize prohibited action', async () => {
  const response = await request(app)
    .post('/api/v1/authorize')
    .set('x-request-id', 'req-deny-001')
    .send({
      actorType: 'user',
      actorId: 'actor-002',
      role: 'admin',
      action: 'secret_access',
    });

  assert.equal(response.status, 403);
  assert.equal(response.body.decision, 'deny');
  createdDecisionIds.push(response.body.decisionId);

  const decisionLookup = await request(app).get(`/api/v1/decisions/${response.body.decisionId}`);
  assert.equal(decisionLookup.status, 200);
  assert.equal(decisionLookup.body.requestId, 'req-deny-001');
});

test('POST /api/v1/authorize approval-required action', async () => {
  const response = await request(app)
    .post('/api/v1/authorize')
    .send({
      actorType: 'service',
      actorId: 'svc-001',
      role: 'release_manager',
      action: 'production_deploy',
      requestId: 'req-approval-001',
    });

  assert.equal(response.status, 202);
  assert.equal(response.body.decision, 'approval_required');
  assert.equal(response.body.approvalStatus, 'required');
  createdDecisionIds.push(response.body.decisionId);

  const listResponse = await request(app).get('/api/v1/decisions?limit=1');
  assert.equal(listResponse.status, 200);
  assert.equal(listResponse.body.decisions.length, 1);
  assert.equal(listResponse.body.decisions[0].decisionId, response.body.decisionId);
});

test('POST /api/v1/authorize invalid payload', async () => {
  const response = await request(app)
    .post('/api/v1/authorize')
    .set('x-request-id', 'req-invalid-001')
    .send({
      actorType: 'user',
      actorId: 'actor-invalid-001',
      role: 'admin',
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.code, 'INVALID_REQUEST');
  assert.ok(response.body.decisionId);

  const decisionLookup = await request(app).get(`/api/v1/decisions/${response.body.decisionId}`);
  assert.equal(decisionLookup.status, 200);
  assert.equal(decisionLookup.body.decision, 'deny');
  assert.equal(decisionLookup.body.requestId, 'req-invalid-001');
});
