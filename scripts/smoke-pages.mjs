import { spawn } from 'node:child_process';
const server = spawn('node', ['server.js'], { env: { ...process.env, PORT: '4020' } });
const routes=['/','/omos','/ohi','/models','/tools','/artifacts','/docs','/shop','/latest-news','/dashboard','/legal','/contact','/protocol','/algorithm','/digital-sanctuary'];
await new Promise(r=>setTimeout(r,1500));
for (const route of routes){ const res=await fetch(`http://127.0.0.1:4020${route}`); if(res.status!==200) throw new Error(`${route} -> ${res.status}`);}
server.kill('SIGTERM');
console.log('smoke pages passed');
