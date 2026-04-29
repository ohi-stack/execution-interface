import assert from 'node:assert/strict';
import { before, test } from 'node:test';

import jwt from 'jsonwebtoken';
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
  assert.equal(response.body.service, 'onegodian-service');
  assert.equal(typeof response.body.version, 'string');
});

test('GET /api/products without auth is unauthorized', async () => {
  const response = await request(app).get('/api/products');
  assert.equal(response.status, 401);
});

test('POST /billing/checkout rejects unauthenticated requests', async () => {
  const response = await request(app).post('/billing/checkout').send({ plan: 'monthly' });
  assert.equal(response.status, 401);
});

test('POST /billing/checkout rejects invalid plans for authenticated requests', async () => {
  const token = `Bearer ${jwt.sign({ sub: 'user_123', email: 'user@onegodian.org', role: 'free' }, process.env.JWT_SECRET as string, { expiresIn: '1h' })}`;

  const response = await request(app)
    .post('/billing/checkout')
    .set('authorization', token)
    .send({ plan: 'invalid-plan' });

  assert.equal(response.status, 400);
});

test('POST /billing/webhook rejects invalid or missing signatures', async () => {
  const response = await request(app)
    .post('/billing/webhook')
    .send({ id: 'evt_123', type: 'checkout.session.completed', data: { object: {} } });

  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, 'invalid_signature');
});
