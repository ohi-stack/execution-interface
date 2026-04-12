import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

let server;
let baseUrl;

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

test('GET /health responds with authoritative standard marker', async () => {
  const response = await fetch(`${baseUrl}/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, 'ok');
  assert.equal(body.standard, 'OTS-V5-corrected');
});

test('POST /v1/time/convert/gregorian-to-ot validates required input', async () => {
  const response = await fetch(`${baseUrl}/v1/time/convert/gregorian-to-ot`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({}),
  });

  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error.code, 'VALIDATION_ERROR');
});
