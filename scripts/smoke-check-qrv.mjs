const domains = [
  'https://registry.qrv.network',
  'https://api.qrv.network',
  'https://issuer.qrv.network',
  'https://verify.qrv.network',
  'https://api.quantumohi.com'
];

const smokeQrvid = process.env.SMOKE_QRVID || `QRV-SMOKE-${Date.now()}`;
const smokeApiKey = process.env.SMOKE_API_KEY || '';
console.log(`smoke_qrvid=${smokeQrvid}`);

async function check(url, options = {}) {
  const res = await fetch(url, { redirect: 'follow', ...options });
  return { url, status: res.status, ok: res.ok };
}

async function provisionSmokeRecord() {
  if (!smokeApiKey) {
    return { ok: false, reason: 'SMOKE_API_KEY not set; skipping create step' };
  }

  const createRes = await fetch('https://api.qrv.network/api/v1/registry/create', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': smokeApiKey,
      'x-actor-role': 'admin'
    },
    body: JSON.stringify({
      qrvid: smokeQrvid,
      issuer: 'issuer-qrv-prod-001',
      subject: 'smoke-user',
      issued_at_utc: new Date().toISOString(),
      metadata_hash: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    })
  });

  return {
    ok: createRes.ok || createRes.status === 409,
    reason: `create status ${createRes.status}`
  };
}

const checks = [];
for (const domain of domains) {
  checks.push(await check(domain));
  checks.push(await check(`${domain}/healthz`));
  checks.push(await check(`${domain}/readyz`));
}

const provision = await provisionSmokeRecord();
console.log(`provision: ${provision.ok ? 'ok' : 'warn'} (${provision.reason})`);
checks.push(await check(`https://verify.qrv.network/verify/${encodeURIComponent(smokeQrvid)}`));

let failed = false;
for (const c of checks) {
  console.log(`${c.status} ${c.url}`);
  if (!c.ok) failed = true;
}

if (failed) {
  process.exit(1);
}
