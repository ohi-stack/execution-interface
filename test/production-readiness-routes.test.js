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

test('rejects encoded newline path payloads', async () => {
  const response = await fetch(`${baseUrl}/login%0Ahttps://issuer.qrv.network/dashboard`);
  assert.equal(response.status, 400);
  const body = await response.json();
  assert.equal(body.code, 'INVALID_PATH');
});

test('dashboard route returns deployment guidance json', async () => {
  const response = await fetch(`${baseUrl}/dashboard`);
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.code, 'ISSUER_UI_NOT_DEPLOYED');
});
