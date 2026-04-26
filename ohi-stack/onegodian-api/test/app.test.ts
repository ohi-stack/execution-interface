import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

let app: Awaited<typeof import('../src/app')>['default'];

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.CORS_ORIGINS = 'https://api.onegodian.org';
  const module = await import('../src/app');
  app = module.default;
});

describe('onegodian-api endpoints', () => {
  it('returns service root payload', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  it('returns health data', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
  });

  it('returns status payload', async () => {
    const response = await request(app).get('/api/status');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('online');
  });

  it('returns version payload', async () => {
    const response = await request(app).get('/api/version');

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  it('returns placeholder for agent execute', async () => {
    const response = await request(app).post('/api/agents/execute').send({ task: 'hello' });

    expect(response.status).toBe(501);
  });

  it('returns 404 for unknown route', async () => {
    const response = await request(app).get('/missing');

    expect(response.status).toBe(404);
    expect(response.body.ok).toBe(false);
  });
});
