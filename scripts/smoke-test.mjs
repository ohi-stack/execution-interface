import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const port = 4010;
const base = `http://127.0.0.1:${port}`;
const routes = ['/', '/ecosystem', '/overview', '/omos', '/algorithm', '/remember', '/time', '/commerce', '/identity', '/institutional', '/status'];

const server = spawn('npx', ['next', 'dev', '-p', String(port)], { stdio: 'pipe', detached: true });

await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('server start timeout')), 30000);
  const onData = (data) => {
    const text = data.toString();
    if (text.includes('Ready')) {
      clearTimeout(timer);
      resolve();
    }
  };
  server.stdout.on('data', onData);
  server.stderr.on('data', onData);
});

try {
  for (const route of routes) {
    const res = await fetch(`${base}${route}`);
    assert.equal(res.status, 200, `${route} should return 200`);
  }

  const apiManifest = await (await fetch(`${base}/api/manifest`)).json();
  assert.deepEqual(apiManifest.routes, routes);
  assert.equal(apiManifest.commerceEngine, 'https://onegodian.com');
  assert.equal(apiManifest.interpretationPlatform, 'https://onegodian.org');

  console.log('Smoke tests passed');
} finally {
  process.kill(-server.pid, 'SIGTERM');
}
