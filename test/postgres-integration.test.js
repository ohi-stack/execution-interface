import test from 'node:test';
import assert from 'node:assert/strict';

const shouldRun = process.env.RUN_PG_INTEGRATION === '1' && Boolean(process.env.DATABASE_URL);

const integration = shouldRun ? test : test.skip;

integration('postgres lifecycle integration: create -> verify -> revoke -> restart -> verify revoked', async () => {
  const { default: app } = await import('../src/app.js');

  const start = () => new Promise((resolve) => {
    const server = app.listen(0, () => resolve(server));
  });

  const request = async (base, path, options = {}) => {
    const response = await fetch(`${base}${path}`, options);
    return { status: response.status, body: await response.json() };
  };

  let server = await start();
  let baseUrl = `http://127.0.0.1:${server.address().port}`;

  const create = await request(baseUrl, '/registry/create', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-actor-role': 'issuer',
      'x-issuer-id': 'onegodian-llc',
      'x-issuer-key': 'prod-secret-key',
    },
    body: JSON.stringify({
      qrvid: 'QRV-PROD-CERT-000001',
      recipient: 'ONEGODIAN, LLC',
      subject: 'QR-V Genesis Verification Certificate',
      title: 'QR-V Genesis Verification Certificate',
      issuer: 'onegodian-llc',
      issueDate: '2026-04-24T00:00:00Z',
    }),
  });
  assert.ok([201, 409].includes(create.status));

  const verifyInitial = await request(baseUrl, '/api/v1/verify/QRV-PROD-CERT-000001');
  assert.equal(verifyInitial.status, 200);

  const revoke = await request(baseUrl, '/api/v1/revoke/QRV-PROD-CERT-000001', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-actor-role': 'admin',
      'x-issuer-id': 'onegodian-llc',
      'x-issuer-key': 'prod-secret-key',
    },
    body: JSON.stringify({ revoked_at_utc: '2026-04-24T12:00:00Z', reason: 'integration revoke' }),
  });
  assert.equal(revoke.status, 200);

  await new Promise((resolve) => server.close(resolve));
  server = await start();
  baseUrl = `http://127.0.0.1:${server.address().port}`;

  const verifyAfterRestart = await request(baseUrl, '/api/v1/verify/QRV-PROD-CERT-000001');
  assert.equal(verifyAfterRestart.status, 200);
  assert.equal(verifyAfterRestart.body.status, 'REVOKED');

  await new Promise((resolve) => server.close(resolve));
});
