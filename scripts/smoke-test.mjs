import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const port = 4010;
const base = `http://127.0.0.1:${port}`;
const routes = [
  '/', '/dashboard', '/sitemap', '/systems-model', '/ecosystem', '/apps', '/plugins', '/api-status', '/system-health',
  '/omos', '/omos/manifest', '/omos/pages', '/omos/health', '/omos/sync', '/omos/plugins', '/omos/properties',
  '/architecture', '/architecture/ohi', '/architecture/runtime', '/architecture/interfaces', '/architecture/infrastructure', '/architecture/omos-sync',
  '/algorithm', '/algorithm/protocol', '/algorithm/experience', '/algorithm/community', '/algorithm/orientation',
  '/registry', '/time', '/portfolio', '/records', '/tools', '/certificates', '/members', '/settings', '/admin',
  '/api/health', '/api/manifest', '/api/pages', '/api/sync/omos', '/api/properties', '/api/plugins', '/api/system-health', '/api/plugin-consumers', '/api/plugin-shortcodes', '/api/plugin-sync', '/api/tools', '/api/stats', '/api/artifacts', '/api/dashboard'
];

const server = spawn('npx', ['next', 'dev', '-p', String(port)], { stdio: 'pipe', detached: true });

await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('server start timeout')), 30000);
  server.stdout.on('data', (d) => {
    if (d.toString().includes('Ready')) {
      clearTimeout(timer);
      resolve();
    }
  });
  server.stderr.on('data', (d) => {
    if (d.toString().includes('Ready')) {
      clearTimeout(timer);
      resolve();
    }
  });
});

try {
  for (const route of routes) {
    const res = await fetch(`${base}${route}`);
    if (res.status !== 200) throw new Error(`${route} returned ${res.status}`);
  }

  const properties = await (await fetch(`${base}/api/properties`)).json();
  assert.equal(Array.isArray(properties.properties), true);
  assert.equal(properties.total, 7);

  const plugins = await (await fetch(`${base}/api/plugins`)).json();
  assert.equal(Array.isArray(plugins.plugins), true);
  assert.equal(plugins.total, 7);

  const apiManifest = await (await fetch(`${base}/api/manifest`)).json();
  assert.equal(Array.isArray(apiManifest.pluginSync?.endpoints), true);

  const consumers = await (await fetch(`${base}/api/plugin-consumers`)).json();
  assert.equal(consumers.consumers.length >= 3, true);

  const shortcodes = await (await fetch(`${base}/api/plugin-shortcodes`)).json();
  assert.equal(shortcodes.shortcodes.includes('[omos_manifest]'), true);

  console.log('Smoke tests passed');
} finally {
  process.kill(-server.pid, 'SIGTERM');
}
