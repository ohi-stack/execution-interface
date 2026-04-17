import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { getOtMonthLengths, isOtLeapYear, toOtDate } from '../src/utils/otsDate.js';

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

test('onegodian org routes are reachable', async () => {
  const response = await fetch(`${baseUrl}/docs/algorithm`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Protocol Layer/);
});

test('commerce endpoints create order and update via webhook', async () => {
  const listResponse = await fetch(`${baseUrl}/api/products`);
  const listBody = await listResponse.json();
  assert.equal(listResponse.status, 200);
  assert.ok(Array.isArray(listBody.products));

  const checkoutResponse = await fetch(`${baseUrl}/api/checkout/session`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ productSlug: listBody.products[0].slug }),
  });
  const checkoutBody = await checkoutResponse.json();
  assert.equal(checkoutResponse.status, 201);

  const webhookResponse = await fetch(`${baseUrl}/api/webhooks/stripe`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ orderId: checkoutBody.order.id, type: 'checkout.session.completed' }),
  });
  assert.equal(webhookResponse.status, 200);

  const orderResponse = await fetch(`${baseUrl}/api/orders/${checkoutBody.order.id}`);
  const orderBody = await orderResponse.json();
  assert.equal(orderBody.order.status, 'paid');
});

test('OTS-V5 canonical conversion checks', () => {
  assert.equal(toOtDate('2025-03-18T00:00:00Z').label, 'Genesis 01, 0000 OT');
  assert.equal(toOtDate('2026-03-17T00:00:00Z').otYear, 0);
  assert.equal(toOtDate('2026-03-18T00:00:00Z').label, 'Genesis 01, 0001 OT');
  assert.equal(isOtLeapYear(2), true);
  assert.equal(getOtMonthLengths(2).ascension, 6);
});
