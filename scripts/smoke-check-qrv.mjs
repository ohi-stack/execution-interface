const baseUrl = (process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const apiBase = `${baseUrl}/api/v1`;
const smokeQrvid = process.env.SMOKE_QRVID || `QRV-SMOKE-${Date.now()}`;
const smokeApiKey = process.env.SMOKE_API_KEY || (process.env.QRV_API_KEYS || '').split(',')[0] || '';

const check = async (url, options = {}) => {
  const response = await fetch(url, options);
  const text = await response.text();
  return { ok: response.ok, status: response.status, url, body: text.slice(0, 180) };
};

const checks = [];
checks.push(await check(`${baseUrl}/healthz`));
checks.push(await check(`${baseUrl}/readyz`));
checks.push(await check(`${baseUrl}/version`));

checks.push(await check(`${apiBase}/registry/create`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-api-key': smokeApiKey, 'x-actor-role': 'issuer' },
  body: JSON.stringify({
    qrvid: smokeQrvid,
    issuer: 'issuer-qrv-prod-001',
    subject: 'smoke-subject',
    issued_at_utc: new Date().toISOString(),
  }),
}));

checks.push(await check(`${apiBase}/verify/${encodeURIComponent(smokeQrvid)}`));

const failed = checks.filter((entry) => !entry.ok);
for (const entry of checks) {
  console.log(`${entry.ok ? 'PASS' : 'FAIL'} ${entry.status} ${entry.url}`);
}

if (failed.length > 0) {
  process.exitCode = 1;
  console.error(JSON.stringify(failed, null, 2));
} else {
  console.log(`smoke_qrvid=${smokeQrvid}`);
}
