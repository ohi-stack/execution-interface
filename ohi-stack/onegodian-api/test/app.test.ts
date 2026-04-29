import assert from 'node:assert/strict';
import { before, test } from 'node:test';

import request from 'supertest';

let app: Awaited<typeof import('../src/app')>['default'];

before(async () => {
  process.env.NODE_ENV = 'test';
  process.env.CORS_ORIGIN = 'https://api.onegodian.org';
  process.env.APP_URL = 'https://api.onegodian.org';
  process.env.JWT_SECRET = 'abcdefghijklmnopqrstuvwxyz123456';
  process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/onegodian';
  process.env.DIRECT_URL = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  process.env.STRIPE_SECRET_KEY = 'sk_test_123';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_123';

  const module = await import('../src/app');
  app = module.default;
});

test('GET /health returns 200', async () => {
  const response = await request(app).get('/health');
  assert.equal(response.status, 200);
  assert.equal(response.body.ok, true);
});

test('GET /ready returns readiness response', async () => {
  const response = await request(app).get('/ready');
  assert.ok([200, 503].includes(response.status));
  assert.equal(typeof response.body.ok, 'boolean');
});

test('GET /version returns service version details', async () => {
  const response = await request(app).get('/version');
  assert.equal(response.status, 200);
  assert.equal(response.body.ok, true);
  assert.equal(typeof response.body.version, 'string');
});

test('GET /api/products without auth is unauthorized', async () => {
  const response = await request(app).get('/api/products');
  assert.equal(response.status, 401);
});
