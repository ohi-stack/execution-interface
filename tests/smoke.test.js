const assert = require('assert');
const http = require('http');
const { app, PUBLIC_ROUTES } = require('../server');

const routes = [...PUBLIC_ROUTES, '/api/health', '/api/manifest'];

function request(port, route, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port, path: route, method }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  const server = app.listen(0);
  const { port } = server.address();
  for (const route of routes) {
    const res = await request(port, route);
    assert.equal(res.status, 200, `${route} should return 200`);
    if (!route.startsWith('/api/') && route !== '/dashboard') assert.match(res.body, /<html/i, `${route} should render html`);
  }
  const health = await request(port, '/api/health');
  assert.equal(JSON.parse(health.body).status, 'ok');

  const manifest = JSON.parse((await request(port, '/api/manifest')).body);
  assert.deepEqual(manifest.publicRoutes, PUBLIC_ROUTES);

  const processDenied = await request(port, '/process', 'POST');
  assert.equal(processDenied.status, 401);

  server.close();
  console.log('smoke tests passed');
})();
