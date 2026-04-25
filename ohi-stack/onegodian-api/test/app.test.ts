import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../src/app';

describe('onegodian-api endpoints', () => {
  it('returns health data', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('returns v1 status', async () => {
    const response = await request(app).get('/v1/status');

    expect(response.status).toBe(200);
    expect(response.body.version).toBe('v1');
  });

  it('returns placeholder for identity verify', async () => {
    const response = await request(app).post('/v1/identity/verify').send({});

    expect(response.status).toBe(501);
  });

  it('returns placeholder for entitlements check', async () => {
    const response = await request(app).post('/v1/entitlements/check').send({});

    expect(response.status).toBe(501);
  });
});
