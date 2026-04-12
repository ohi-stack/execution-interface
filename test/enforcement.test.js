import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { resetRecordStore } from '../src/services/recordStore.js';
import { resetHistoricalEventArchive } from '../src/services/historicalEventArchive.js';
import { setOtDerivationResolver } from '../src/services/otCanonicalClient.js';

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
  resetHistoricalEventArchive();
  setOtDerivationResolver(async ({ timestamp_utc }) => ({
    ot_year: 7026,
    ot_month_name: 'First Dawn',
    ot_day: Number(timestamp_utc.slice(8, 10)),
    ot_day_order_name: 'Order of Continuance',
    source_authority: 'onegodian-api',
    version_standard: 'onegodian-canonical/v1',
  }));
});

test.after(() => {
  setOtDerivationResolver(null);
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

test('historical events are archived with canonical dual-date fields', async () => {
  const createResponse = await jsonRequest({
    method: 'POST',
    path: '/api/v1/history/events',
    body: {
      title: 'Archive event',
      description: 'Canonical archive test',
      timestamp_utc: '2026-04-04T03:20:00Z',
      timezone: 'UTC',
    },
  });

  assert.equal(createResponse.status, 201);
  assert.equal(typeof createResponse.body.event_id, 'string');
  assert.equal(createResponse.body.gregorian_date, '2026-04-04');
  assert.equal(createResponse.body.ot_year, 7026);
  assert.equal(createResponse.body.source_authority, 'onegodian-api');

  const listResponse = await jsonRequest({
    method: 'GET',
    path: '/api/v1/history/events',
  });

  assert.equal(listResponse.status, 200);
  assert.equal(Array.isArray(listResponse.body.events), true);
  assert.equal(listResponse.body.events.length, 1);
});

test('legacy migration helper derives OT fields without changing provided UTC chronology', async () => {
  const migrateResponse = await jsonRequest({
    method: 'POST',
    path: '/api/v1/history/events/migrate',
    body: {
      event_type: 'legacy.note',
      message: 'legacy entry',
      occurred_at_utc: '2022-11-10T10:30:00Z',
      timezone: 'UTC',
    },
  });

  assert.equal(migrateResponse.status, 201);
  assert.equal(migrateResponse.body.timestamp_utc, '2022-11-10T10:30:00.000Z');
  assert.equal(migrateResponse.body.title, 'legacy.note');
  assert.equal(migrateResponse.body.ot_month_name, 'First Dawn');
});

test('legacy migration rejects mismatched gregorian chronology instead of silently editing', async () => {
  const migrateResponse = await jsonRequest({
    method: 'POST',
    path: '/api/v1/history/events/migrate',
    body: {
      event_type: 'legacy.note',
      occurred_at_utc: '2022-11-10T10:30:00Z',
      timezone: 'UTC',
      gregorian_date: '2022-11-11',
    },
  });

  assert.equal(migrateResponse.status, 400);
  assert.equal(migrateResponse.body.code, 'MIGRATION_INVALID');
});
