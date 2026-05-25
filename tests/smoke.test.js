const assert = require('assert');
const http = require('http');
const { app } = require('../server');

const routes = ['/', '/docs', '/tools', '/artifacts', '/shop', '/dashboard'];

function get(port, route) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port, path: route, method: 'GET' }, (res) => {
      res.resume();
      res.on('end', () => resolve(res.statusCode));
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  const server = app.listen(0);
  const { port } = server.address();
  for (const route of routes) {
    const status = await get(port, route);
    assert.ok(status < 500, `${route} should not return 5xx`);
  }
  server.close();
  console.log('smoke routes passed');
})();
