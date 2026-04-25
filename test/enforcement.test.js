import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { resetRecordStore } from '../src/services/recordStore.js';

let server;
let baseUrl;

const jsonRequest = async ({ method, path, headers = {}, body }) => {
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
  process.env.QRV_API_KEYS = 'test-api-key';
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test.beforeEach(() => {
  resetRecordStore();
});

const validRecord = {
  qrvid: 'QRV-ENFORCE-1001',
  issuer: 'issuer-qrv-prod-001',
  subject: 'subject-1',
  issued_at_utc: '2026-04-04T00:00:00Z',
};

const writeHeaders = { 'x-actor-role': 'issuer', 'x-api-key': 'test-api-key' };

test('invalid create payload is rejected with structured 4xx error', async () => {
  const response = await jsonRequest({ method: 'POST', path: '/api/v1/registry/create', headers: writeHeaders, body: { qrvid: 'bad' } });
  assert.equal(response.status, 400);
  assert.equal(response.body.code, 'INVALID_REQUEST');
});

test('status logic returns deterministic statuses', async () => {
  await jsonRequest({ method: 'POST', path: '/api/v1/registry/create', headers: writeHeaders, body: { ...validRecord, qrvid: 'QRV-ENFORCE-VERIFIED' } });
  await jsonRequest({ method: 'POST', path: '/api/v1/registry/create', headers: writeHeaders, body: { ...validRecord, qrvid: 'QRV-ENFORCE-EXPIRED', expires_at_utc: '2020-01-01T00:00:00Z' } });

  const verified = await jsonRequest({ method: 'GET', path: '/api/v1/verify/QRV-ENFORCE-VERIFIED' });
  assert.equal(verified.body.status, 'VERIFIED');

  await jsonRequest({
    method: 'POST',
    path: '/api/v1/revoke',
    headers: { 'x-actor-role': 'admin', 'x-api-key': 'test-api-key' },
    body: { qrvid: 'QRV-ENFORCE-VERIFIED', revoked_at_utc: '2026-04-04T01:00:00Z', reason: 'security incident' },
  });

  const revoked = await jsonRequest({ method: 'GET', path: '/api/v1/verify/QRV-ENFORCE-VERIFIED' });
  assert.equal(revoked.body.status, 'REVOKED');

  const expired = await jsonRequest({ method: 'GET', path: '/api/v1/verify/QRV-ENFORCE-EXPIRED' });
  assert.equal(expired.body.status, 'EXPIRED');

  const missing = await jsonRequest({ method: 'GET', path: '/api/v1/verify/QRV-DOES-NOT-EXIST' });
  assert.equal(missing.status, 404);
  assert.equal(missing.body.status, 'NOT_FOUND');
});

test('standardized v1 routes support create, verify, and revoke flow', async () => {
  const create = await jsonRequest({ method: 'POST', path: '/api/v1/registry/create', headers: writeHeaders, body: { ...validRecord, qrvid: 'QRV-ENFORCE-STANDARD-01' } });
  assert.equal(create.status, 201);

  const verifyBefore = await jsonRequest({ method: 'GET', path: '/api/v1/verify/QRV-ENFORCE-STANDARD-01' });
  assert.equal(verifyBefore.body.status, 'VERIFIED');

  const revoke = await jsonRequest({ method: 'POST', path: '/api/v1/revoke', headers: { 'x-actor-role': 'admin', 'x-api-key': 'test-api-key' }, body: { qrvid: 'QRV-ENFORCE-STANDARD-01', revoked_at_utc: '2026-04-04T01:00:00Z', reason: 'issuer requested revocation' } });
  assert.equal(revoke.status, 200);

  const verifyAfter = await jsonRequest({ method: 'GET', path: '/api/v1/verify/QRV-ENFORCE-STANDARD-01' });
  assert.equal(verifyAfter.body.status, 'REVOKED');
});
