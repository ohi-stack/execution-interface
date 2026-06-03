const assert = require('assert');
const http = require('http');

process.env.OMOS_API_KEYS = process.env.OMOS_API_KEYS || 'test:8f6afa1a9b2e2b5d6c831bea59b15a864694611f8b9876c92de3badd051ecff9:enterprise';
process.env.OMOS_ALLOWED_ORIGINS = process.env.OMOS_ALLOWED_ORIGINS || 'https://omos.onegodian.com';

const { app, PUBLIC_ROUTES, API_ROUTES } = require('../server');

const routes = [...PUBLIC_ROUTES, '/api/health', '/api/manifest', '/api/system-health', '/version'];
const testApiKey = 'omos_live_test_key_1234567890';

function request(port, route, options = {}) {
  return new Promise((resolve, reject) => {
    const body = options.body ? JSON.stringify(options.body) : undefined;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: route,
        method: options.method || 'GET',
        headers: {
          ...(body ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(body) } : {}),
          ...(options.headers || {})
        }
      },
      (res) => {
        let responseBody = '';
        res.on('data', (c) => (responseBody += c));
        res.on('end', () => resolve({ status: res.statusCode, body: responseBody, headers: res.headers }));
      }
    );
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

(async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    for (const route of routes) {
      const res = await request(port, route);
      assert.equal(res.status, 200, `${route} should return 200`);
      assert.ok(res.headers['x-request-id'], `${route} should include request id`);
      assert.equal(res.headers['x-content-type-options'], 'nosniff', `${route} should set nosniff`);
      if (!route.startsWith('/api/') && route !== '/dashboard' && route !== '/version') assert.match(res.body, /<html/i, `${route} should render html`);
    }

    const health = await request(port, '/api/health');
    const healthPayload = JSON.parse(health.body);
    assert.equal(healthPayload.status, 'ok');
    assert.ok(healthPayload.timestampUtc);

    const manifest = JSON.parse((await request(port, '/api/manifest')).body);
    assert.deepEqual(manifest.publicRoutes, PUBLIC_ROUTES);
    assert.deepEqual(manifest.apiRoutes, API_ROUTES);
    assert.ok(manifest.apiRoutes.includes('/api/system-health'));
    assert.ok(manifest.apiRoutes.includes('/api/process'));


    const systemHealth = JSON.parse((await request(port, '/api/system-health')).body);
    assert.ok(['ready', 'degraded'].includes(systemHealth.status));
    assert.ok(Array.isArray(systemHealth.checks));
    assert.ok(systemHealth.timestampUtc);

    const processDenied = await request(port, '/process', { method: 'POST' });
    assert.equal(processDenied.status, 401);
    assert.ok(JSON.parse(processDenied.body).requestId);

    const statsDenied = await request(port, '/api/stats');
    assert.equal(statsDenied.status, 401);

    const invalidProcess = await request(port, '/process', {
      method: 'POST',
      headers: { 'x-omos-key': testApiKey },
      body: { content: { raw: '' } }
    });
    assert.equal(invalidProcess.status, 400);

    const validProcess = await request(port, '/process', {
      method: 'POST',
      headers: { 'x-omos-key': testApiKey },
      body: { content: { raw: 'production readiness smoke' }, metadata: { source: 'smoke' } }
    });
    assert.equal(validProcess.status, 200);
    assert.equal(JSON.parse(validProcess.body).status, 'ok');
    assert.ok(validProcess.headers['ratelimit-limit']);

    const validCanonicalProcess = await request(port, '/api/process', {
      method: 'POST',
      headers: { 'x-omos-key': testApiKey },
      body: { content: { raw: 'canonical api process smoke' }, metadata: { source: 'smoke' } }
    });
    assert.equal(validCanonicalProcess.status, 200);
    assert.equal(JSON.parse(validCanonicalProcess.body).status, 'ok');

    const disallowedOrigin = await request(port, '/api/health', { headers: { origin: 'https://evil.example' } });
    assert.equal(disallowedOrigin.status, 403);

    const allowedOrigin = await request(port, '/api/health', { headers: { origin: 'https://omos.onegodian.com' } });
    assert.equal(allowedOrigin.status, 200);
    assert.equal(allowedOrigin.headers['access-control-allow-origin'], 'https://omos.onegodian.com');

    console.log('smoke tests passed');
  } finally {
    server.close();
  }
})();
