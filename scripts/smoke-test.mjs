import { spawn } from 'node:child_process';

const port = 4010;
const base = `http://127.0.0.1:${port}`;
const routes = ['/', '/omos', '/protocol', '/algorithm', '/ohi', '/docs', '/tools', '/artifacts', '/manifest', '/api/health', '/api/manifest', '/api/pages'];

const server = spawn('npx', ['next', 'dev', '-p', String(port)], { stdio: 'pipe' });

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
  console.log('Smoke tests passed');
} finally {
  server.kill('SIGTERM');
}
