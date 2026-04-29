import assert from 'node:assert/strict';
import { before, test } from 'node:test';

import jwt from 'jsonwebtoken';
import request from 'supertest';

type AppModule = Awaited<typeof import('../src/app')>['default'];

const baseEnv = {
  NODE_ENV: 'test',
  CORS_ORIGIN: 'https://api.onegodian.org',
  APP_URL: 'https://api.onegodian.org',
  JWT_SECRET: 'abcdefghijklmnopqrstuvwxyz123456',
  DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/onegodian',
  DIRECT_URL: 'postgresql://postgres:postgres@localhost:5432/onegodian'
};

const loadApp = async (env: Record<string, string | undefined>): Promise<AppModule> => {
  Object.assign(process.env, baseEnv);
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  const module = await import(`../src/app?test=${Date.now()}_${Math.random()}`);
  return module.default;
};


let mockApp: AppModule;
let stripeApp: AppModule;

before(async () => {
  const persistenceModule = await import('../src/lib/persistence');
  persistenceModule.persistence.createBillingEvent = async (event) => event as never;
  persistenceModule.persistence.activateUserSubscription = async () => undefined as never;
  mockApp = await loadApp({
    STRIPE_SECRET_KEY: undefined,
    STRIPE_WEBHOOK_SECRET: undefined,
    STRIPE_PRICE_MONTHLY: undefined,
    STRIPE_PRICE_PRO: undefined,
    STRIPE_PRICE_FOUNDER: undefined
  });

  stripeApp = await loadApp({
    STRIPE_SECRET_KEY: 'sk_test_123',
    STRIPE_WEBHOOK_SECRET: 'whsec_test_123',
    STRIPE_PRICE_MONTHLY: 'price_monthly',
    STRIPE_PRICE_PRO: 'price_pro',
    STRIPE_PRICE_FOUNDER: 'price_founder'
  });
});

test('POST /billing/checkout rejects unauthenticated requests', async () => {
  const response = await request(mockApp).post('/billing/checkout').send({ plan: 'monthly' });
  assert.equal(response.status, 401);
});

test('POST /billing/checkout rejects invalid plans for authenticated requests', async () => {
  const token = `Bearer ${jwt.sign({ sub: 'user_123', email: 'user@onegodian.org', role: 'free' }, process.env.JWT_SECRET as string, { expiresIn: '1h' })}`;

  const response = await request(mockApp)
    .post('/billing/checkout')
    .set('authorization', token)
    .send({ plan: 'invalid-plan' });

  assert.equal(response.status, 400);
});

test('POST /billing/checkout returns mock session when Stripe is not configured', async () => {
  const token = `Bearer ${jwt.sign({ sub: 'user_123', email: 'user@onegodian.org', role: 'free' }, process.env.JWT_SECRET as string, { expiresIn: '1h' })}`;
  const response = await request(mockApp)
    .post('/billing/checkout')
    .set('authorization', token)
    .send({ plan: 'monthly', price: 'tampered' });

  assert.equal(response.status, 200);
  assert.equal(response.body.mode, 'mock');
  assert.ok(!response.text.includes('sk_test'));
  assert.ok(!response.text.includes('whsec_'));
});

test('POST /billing/webhook rejects invalid signature when webhook secret is configured', async () => {
  const response = await request(stripeApp)
    .post('/billing/webhook')
    .set('stripe-signature', 'invalid')
    .send({ id: 'evt_123', type: 'checkout.session.completed', data: { object: {} } });

  assert.equal(response.status, 400);
});

test('POST /billing/webhook accepts mock JSON only when webhook secret is not configured', async () => {
  const mockResponse = await request(mockApp)
    .post('/billing/webhook')
    .send({ id: 'evt_mock_123', type: 'invoice.payment_failed', data: { object: { customer: 'cus_123' } } });
  assert.equal(mockResponse.status, 200);
  assert.equal(mockResponse.body.mode, 'mock');

  const stripeResponse = await request(stripeApp)
    .post('/billing/webhook')
    .send({ id: 'evt_mock_123', type: 'invoice.payment_failed', data: { object: { customer: 'cus_123' } } });
  assert.equal(stripeResponse.status, 400);
  assert.equal(stripeResponse.body.error.code, 'invalid_signature');
});
