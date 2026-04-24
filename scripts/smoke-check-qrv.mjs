const domains = [
  'https://registry.qrv.network',
  'https://api.qrv.network',
  'https://issuer.qrv.network',
  'https://verify.qrv.network',
  'https://api.quantumohi.com'
];

const knownQrvid = process.env.SMOKE_QRVID || 'QRV-SAMPLE-1001';

async function check(url) {
  const res = await fetch(url, { redirect: 'follow' });
  return { url, status: res.status, ok: res.ok };
}

const checks = [];
for (const domain of domains) {
  checks.push(await check(domain));
  checks.push(await check(`${domain}/healthz`));
  checks.push(await check(`${domain}/readyz`));
}
checks.push(await check(`https://verify.qrv.network/verify/${encodeURIComponent(knownQrvid)}`));

let failed = false;
for (const c of checks) {
  console.log(`${c.status} ${c.url}`);
  if (!c.ok) failed = true;
}

if (failed) {
  process.exit(1);
}
