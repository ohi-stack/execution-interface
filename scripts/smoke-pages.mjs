import { spawn } from 'node:child_process';
const server = spawn('node', ['server.js'], { env: { ...process.env, PORT: '4020' }, detached: true });
const routes = ['/', '/protocol', '/algorithm', '/dashboard', '/api', '/docs', '/use-cases', '/roadmap', '/status'];
await new Promise((resolve) => setTimeout(resolve, 1500));
try {
  for (const route of routes) {
    const res = await fetch(`http://127.0.0.1:4020${route}`);
    if (res.status !== 200) throw new Error(`${route} -> ${res.status}`);
  }
  console.log('smoke pages passed');
} finally {
  process.kill(-server.pid, 'SIGTERM');
}
