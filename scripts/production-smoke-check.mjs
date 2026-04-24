const base = process.env.SMOKE_BASE_URL || 'http://localhost:3000';

const endpoints = ['/healthz', '/readyz', '/version', '/metrics'];

for (const endpoint of endpoints) {
  const response = await fetch(`${base}${endpoint}`);
  const text = await response.text();
  const ok = response.status >= 200 && response.status < 300;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${endpoint} -> ${response.status}`);
  if (!ok) {
    console.log(text.slice(0, 300));
    process.exitCode = 1;
  }
}
