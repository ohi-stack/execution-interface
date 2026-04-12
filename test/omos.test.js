import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

let server;
let baseUrl;

const post = async (path, body) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  return {
    status: response.status,
    body: await response.json(),
  };
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

test('POST /api/omos/timestamp/convert converts UTC to OT', async () => {
  const response = await post('/api/omos/timestamp/convert', {
    from: 'utc',
    timestamp_utc: '2025-03-18T00:00:00Z',
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.result.timestamp_ot, 'Genesis 01, 0000 OT');
});

test('POST /api/omos/classify returns Elder for high score', async () => {
  const response = await post('/api/omos/classify', {
    studyHours: 20,
    serviceActs: 10,
    mentorshipCount: 10,
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.result.level, 'Elder');
});
