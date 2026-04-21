import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

let server;
let baseUrl;

const jsonRequest = async ({ method, path }) => {
  const response = await fetch(`${baseUrl}${path}`, { method });

  return {
    status: response.status,
    body: await response.json().catch(() => ({})),
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

test('health endpoint reports onegodian public site service', async () => {
  const response = await jsonRequest({ method: 'GET', path: '/health' });

  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'ok');
  assert.equal(response.body.service, 'onegodian-public-site');
});

test('ot convert rejects missing iso_utc', async () => {
  const response = await jsonRequest({ method: 'GET', path: '/api/v1/ot/convert' });

  assert.equal(response.status, 400);
  assert.equal(response.body.code, 'INVALID_REQUEST');
});

test('ot convert rejects non-utc iso_utc format', async () => {
  const response = await jsonRequest({ method: 'GET', path: '/api/v1/ot/convert?iso_utc=2026-04-11T09:00:00' });

  assert.equal(response.status, 400);
  assert.equal(response.body.code, 'INVALID_REQUEST');
});
