import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { prisma } from '../src/lib/prisma';
import { persistence } from '../src/lib/persistence';

let app: Awaited<typeof import('../src/app')>['default'];
let authToken = '';
let downloadToken = '';
let testEmail = '';
let testUserId = '';

beforeAll(async () => {
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

beforeEach(async () => {
  await prisma.downloadToken.deleteMany();
  await prisma.order.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.billingEvent.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      { id: 'product_pdf_foundations', name: 'Onegodian Foundations PDF', type: 'pdf', priceCents: 1900 },
      { id: 'product_course_alignment', name: 'Alignment Mastery Course', type: 'course', priceCents: 4900 },
      { id: 'product_toolkit_builder', name: 'Builder Toolkit', type: 'toolkit', priceCents: 9900 }
    ]
  });
});

describe('onegodian-api endpoints', () => {
  it('returns service root payload', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  it('supports signup/login/me flow with JWT auth', async () => {
    const email = `user-${Date.now()}@onegodian.org`;
    testEmail = email;

    const signup = await request(app).post('/api/members/signup').send({
      email,
      password: 'password123',
      name: 'Test User'
    });

    expect(signup.status).toBe(201);
    expect(signup.body.token).toBeTypeOf('string');

    const login = await request(app).post('/api/members/login').send({
      email,
      password: 'password123'
    });

    expect(login.status).toBe(200);
    authToken = login.body.token;

    const me = await request(app).get('/api/members/me').set('Authorization', `Bearer ${authToken}`);
    expect(me.status).toBe(200);
    expect(me.body.user.email).toBe(email);
    testUserId = me.body.user.id;
  });

  it('returns readiness and metrics payloads based on database state', async () => {
    const spy = vi.spyOn(prisma, '$queryRaw');
    spy.mockResolvedValueOnce([{ '?column?': 1 }] as never);

    const readyOk = await request(app).get('/ready');
    expect(readyOk.status).toBe(200);

    spy.mockRejectedValueOnce(new Error('db down'));
    const readyFail = await request(app).get('/ready');
    expect(readyFail.status).toBe(503);

    const metrics = await request(app).get('/metrics');
    expect(metrics.status).toBe(200);
    expect(metrics.body.memory).toBeTypeOf('object');

    spy.mockRestore();
  });

  it('returns unauthorized for billing status without token', async () => {
    const response = await request(app).get('/billing/status');
    expect(response.status).toBe(401);
  });

  it('processes webhook and exposes billing status', async () => {
    const signup = await request(app).post('/api/members/signup').send({
      email: `billing-${Date.now()}@onegodian.org`,
      password: 'password123',
      name: 'Billing User'
    });

    const userId = signup.body.user.id as string;
    authToken = signup.body.token as string;
    const user = await persistence.findUserByEmail(testEmail);
    const userId = user?.id ?? testUserId;

    const webhook = await request(app).post('/billing/webhook').send({
      id: 'evt_test_123',
      type: 'checkout.session.completed',
      data: {
        object: {
          customer: 'cus_test_1',
          subscription: 'sub_test_1',
          metadata: { userId, plan: 'pro' }
        }
      }
    });

    expect(webhook.status).toBe(200);

    const billingStatus = await request(app)
      .get('/billing/status')
      .set('Authorization', `Bearer ${authToken}`);

    expect(billingStatus.status).toBe(200);
    expect(billingStatus.body.subscription.plan).toBe('pro');
  });

  it('fulfills digital products with 24-hour download token', async () => {
    const signup = await request(app).post('/api/members/signup').send({
      email: `product-${Date.now()}@onegodian.org`,
      password: 'password123',
      name: 'Product User'
    });

    authToken = signup.body.token as string;

    const products = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${authToken}`);

    expect(products.status).toBe(200);
    const productId = products.body.products[0].id;

    const purchase = await request(app)
      .post('/api/products/checkout')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ productId });

    expect(purchase.status).toBe(201);
    downloadToken = purchase.body.fulfillment.downloadToken;

    const download = await request(app)
      .get(`/api/products/downloads/${downloadToken}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(download.status).toBe(200);
    expect(download.body.download.url).toContain('/assets/downloads/');
  });

  it('protects admin metrics endpoint by role', async () => {
    const signup = await request(app).post('/api/members/signup').send({
      email: `admin-${Date.now()}@onegodian.org`,
      password: 'password123',
      name: 'Admin User'
    });

    authToken = signup.body.token as string;
    const userId = signup.body.user.id as string;

    const forbidden = await request(app).get('/admin/stats').set('Authorization', `Bearer ${authToken}`);
    expect(forbidden.status).toBe(403);

    await prisma.user.update({ where: { id: userId }, data: { role: 'admin' } });

    const login = await request(app).post('/api/members/login').send({
      email: signup.body.user.email,
    await persistence.updateUserRole(testUserId, 'admin');

    const login = await request(app).post('/api/members/login').send({
      email: testEmail,
      password: 'password123'
    });

    const adminToken = login.body.token;

    const adminStats = await request(app).get('/admin/stats').set('Authorization', `Bearer ${adminToken}`);
    expect(adminStats.status).toBe(200);
    expect(adminStats.body.stats).toBeTypeOf('object');
  });

  it('returns validation error payload for invalid agent execute request', async () => {
    const response = await request(app).post('/api/agents/execute').send({});

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('validation_error');
  });
});
