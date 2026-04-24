import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import app from '../src/app.js';
import { resetRecordStore } from '../src/services/recordStore.js';
import { signRecordHash } from '../src/services/issuerRegistry.js';

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

test('health and version endpoints are available', async () => {
  const health = await fetch(`${baseUrl}/health`);
  const version = await fetch(`${baseUrl}/version`);
  assert.equal(health.status, 200);
  assert.equal(version.status, 200);
});

const validRecord = {
  qrvid: 'QRV-TEST-CERT-100001',
  issuer_id: 'issuer-onegodian-001',
  issuer: 'issuer-qrv',
  subject: 'subject-1',
  issued_at_utc: '2026-04-04T00:00:00Z',
  metadata_hash: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
};

validRecord.signature = signRecordHash({ issuerId: validRecord.issuer_id, hash: validRecord.metadata_hash });

const signJwt = (payload, secret) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
};

const issuerHeaders = {
  'x-actor-role': 'issuer',
  'x-issuer-id': 'issuer-onegodian-001',
  'x-api-key': 'issuer-demo-key',
  authorization: `Bearer ${signJwt({ sub: 'issuer-user', role: 'issuer' }, process.env.JWT_SECRET || 'dev-jwt-secret')}`,
};

const adminAuthHeader = {
  authorization: `Bearer ${signJwt({ sub: 'admin-user', role: 'admin' }, process.env.JWT_SECRET || 'dev-jwt-secret')}`,
};

test('invalid create payload is rejected with structured 4xx error', async () => {
  const response = await jsonRequest({
    method: 'POST',
    path: '/api/v1/records',
    headers: issuerHeaders,
    body: { qrvid: 'bad' },
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.code, 'INVALID_REQUEST');
});

test('policy blocks unauthorized revoke', async () => {
  await jsonRequest({
    method: 'POST',
    path: '/api/v1/records',
    headers: issuerHeaders,
    body: validRecord,
  });

  const response = await jsonRequest({
    method: 'POST',
    path: '/api/v1/records/QRV-TEST-CERT-100001/revoke',
    headers: issuerHeaders,
    body: { revoked_at_utc: '2026-04-04T01:00:00Z', reason: 'test revocation' },
  });

  assert.equal(response.status, 403);
  assert.equal(response.body.code, 'RBAC_DENY');
});

test('status logic returns VERIFIED, REVOKED, EXPIRED, and NOT_FOUND deterministically', async () => {
  await jsonRequest({
    method: 'POST',
    path: '/api/v1/records',
    headers: issuerHeaders,
    body: { ...validRecord, qrvid: 'QRV-TEST-CERT-100002' },
  });

  await jsonRequest({
    method: 'POST',
    path: '/api/v1/records',
    headers: issuerHeaders,
    body: { ...validRecord, qrvid: 'QRV-TEST-CERT-100003', expires_at_utc: '2020-01-01T00:00:00Z' },
  });

  const verified = await jsonRequest({ method: 'GET', path: '/api/v1/verify/QRV-TEST-CERT-100002' });
  assert.equal(verified.status, 200);
  assert.equal(verified.body.status, 'VERIFIED');

  await jsonRequest({
    method: 'POST',
    path: '/api/v1/records/QRV-TEST-CERT-100002/revoke',
    headers: { ...issuerHeaders, ...adminAuthHeader, 'x-actor-role': 'admin' },
    body: { revoked_at_utc: '2026-04-04T01:00:00Z', reason: 'security incident' },
  });

  const revoked = await jsonRequest({ method: 'GET', path: '/api/v1/verify/QRV-TEST-CERT-100002' });
  assert.equal(revoked.status, 200);
  assert.equal(revoked.body.status, 'REVOKED');

  const expired = await jsonRequest({ method: 'GET', path: '/api/v1/verify/QRV-TEST-CERT-100003' });
  assert.equal(expired.status, 200);
  assert.equal(expired.body.status, 'EXPIRED');

  const missing = await jsonRequest({ method: 'GET', path: '/api/v1/verify/QRV-TEST-CERT-999999' });
  assert.equal(missing.status, 404);
  assert.equal(missing.body.status, 'NOT_FOUND');
});

test('invalid revoke payload is rejected with structured 4xx error', async () => {
  await jsonRequest({
    method: 'POST',
    path: '/api/v1/records',
    headers: issuerHeaders,
    body: validRecord,
  });

  const response = await jsonRequest({
    method: 'POST',
    path: '/api/v1/records/QRV-TEST-CERT-100001/revoke',
    headers: { ...issuerHeaders, ...adminAuthHeader, 'x-actor-role': 'admin' },
    body: { reason: 'missing timestamp' },
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.code, 'INVALID_REQUEST');
});

test('canonical V1 flow works: create -> verify -> revoke -> verify revoked', async () => {
  const create = await jsonRequest({
    method: 'POST',
    path: '/api/v1/registry/create',
    headers: issuerHeaders,
    body: { ...validRecord, qrvid: 'QRV-TEST-CERT-100010' },
  });
  assert.equal(create.status, 201);

  const verified = await jsonRequest({ method: 'GET', path: '/api/v1/verify/QRV-TEST-CERT-100010' });
  assert.equal(verified.status, 200);
  assert.equal(verified.body.status, 'VERIFIED');

  const revoke = await jsonRequest({
    method: 'POST',
    path: '/api/v1/revoke',
    headers: { ...issuerHeaders, ...adminAuthHeader, 'x-actor-role': 'admin' },
    body: { qrvid: 'QRV-TEST-CERT-100010', revoked_at_utc: '2026-04-04T01:00:00Z', reason: 'manual revoke' },
  });
  assert.equal(revoke.status, 200);

  const revoked = await jsonRequest({ method: 'GET', path: '/api/v1/verify/QRV-TEST-CERT-100010' });
  assert.equal(revoked.status, 200);
  assert.equal(revoked.body.status, 'REVOKED');
});
