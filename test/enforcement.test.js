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
  issuer: 'issuer-qrv',
  subject: 'subject-1',
  issued_at_utc: '2026-04-04T00:00:00Z',
  metadata_hash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
};

test('invalid create payload is rejected with structured 4xx error', async () => {
  const response = await jsonRequest({
    method: 'POST',
    path: '/api/v1/records',
    headers: { 'x-actor-role': 'issuer' },
    body: { qrvid: 'bad' },
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.code, 'INVALID_REQUEST');
});

test('policy blocks unauthorized revoke', async () => {
  await jsonRequest({
    method: 'POST',
    path: '/api/v1/records',
    headers: { 'x-actor-role': 'issuer' },
    body: validRecord,
  });

  const response = await jsonRequest({
    method: 'POST',
    path: '/api/v1/records/QRV-ENFORCE-1001/revoke',
    headers: { 'x-actor-role': 'issuer' },
    body: { revoked_at_utc: '2026-04-04T01:00:00Z', reason: 'test revocation' },
  });

  assert.equal(response.status, 403);
  assert.equal(response.body.code, 'POLICY_DENY');
});

test('status logic returns VERIFIED, REVOKED, EXPIRED, and NOT_FOUND deterministically', async () => {
  await jsonRequest({
    method: 'POST',
    path: '/api/v1/records',
    headers: { 'x-actor-role': 'issuer' },
    body: { ...validRecord, qrvid: 'QRV-ENFORCE-VERIFIED' },
  });

  await jsonRequest({
    method: 'POST',
    path: '/api/v1/records',
    headers: { 'x-actor-role': 'issuer' },
    body: { ...validRecord, qrvid: 'QRV-ENFORCE-EXPIRED', expires_at_utc: '2020-01-01T00:00:00Z' },
  });

  const verified = await jsonRequest({ method: 'GET', path: '/api/v1/verify/QRV-ENFORCE-VERIFIED' });
  assert.equal(verified.status, 200);
  assert.equal(verified.body.status, 'VERIFIED');

  await jsonRequest({
    method: 'POST',
    path: '/api/v1/records/QRV-ENFORCE-VERIFIED/revoke',
    headers: { 'x-actor-role': 'admin' },
    body: { revoked_at_utc: '2026-04-04T01:00:00Z', reason: 'security incident' },
  });

  const revoked = await jsonRequest({ method: 'GET', path: '/api/v1/verify/QRV-ENFORCE-VERIFIED' });
  assert.equal(revoked.status, 200);
  assert.equal(revoked.body.status, 'REVOKED');

  const expired = await jsonRequest({ method: 'GET', path: '/api/v1/verify/QRV-ENFORCE-EXPIRED' });
  assert.equal(expired.status, 200);
  assert.equal(expired.body.status, 'EXPIRED');

  const missing = await jsonRequest({ method: 'GET', path: '/api/v1/verify/QRV-DOES-NOT-EXIST' });
  assert.equal(missing.status, 404);
  assert.equal(missing.body.status, 'NOT_FOUND');
});

test('invalid revoke payload is rejected with structured 4xx error', async () => {
  await jsonRequest({
    method: 'POST',
    path: '/api/v1/records',
    headers: { 'x-actor-role': 'issuer' },
    body: validRecord,
  });

  const response = await jsonRequest({
    method: 'POST',
    path: '/api/v1/records/QRV-ENFORCE-1001/revoke',
    headers: { 'x-actor-role': 'admin' },
    body: { reason: 'missing timestamp' },
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.code, 'INVALID_REQUEST');
});
