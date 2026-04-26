import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { resetRecordStore } from '../src/services/recordStore.js';

let server;
let baseUrl;

const fetchJson = async (path) => {
  const response = await fetch(`${baseUrl}${path}`);
  const text = await response.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  return { status: response.status, body };
};

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
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

test('smoke: GET /, /healthz, /version, /api/v1/verify/QRV-PROD-CERT-000001', async () => {
  const root = await fetchJson('/');
  assert.equal(root.status, 200);
  assert.equal(typeof root.body, 'string');

  const healthz = await fetchJson('/healthz');
  assert.equal(healthz.status, 200);
  assert.equal(healthz.body.status, 'ok');

  const version = await fetchJson('/version');
  assert.equal(version.status, 200);
  assert.equal(version.body.service, 'execution-interface');

  const verify = await fetchJson('/api/v1/verify/QRV-PROD-CERT-000001');
  assert.equal(verify.status, 200);
  assert.equal(verify.body.qrvid, 'QRV-PROD-CERT-000001');
  assert.equal(verify.body.status, 'VERIFIED');
  assert.equal(typeof verify.body.signature, 'string');
  assert.ok('title' in verify.body);
  assert.ok('hash' in verify.body);
});
