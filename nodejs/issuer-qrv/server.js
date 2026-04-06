const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 3000);
const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const SRC_DIR = path.join(ROOT_DIR, 'src');

const records = [
  {
    qrvid: 'QRV-8E21A1',
    subject: 'Grid export certificate',
    recordType: 'certificate',
    issuer: 'Issuer Operations',
    description: 'Baseline issuance for active energy export assets.',
    referenceId: 'CERT-2026-001',
    status: 'VERIFIED',
    issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    expiresAt: null,
    revokedAt: null,
    revocationReason: '',
    metadataHash: crypto.createHash('sha256').update('CERT-2026-001').digest('hex'),
  },
  {
    qrvid: 'QRV-AD921F',
    subject: 'Installer credential',
    recordType: 'credential',
    issuer: 'Issuer Operations',
    description: 'Credential for approved installation partner.',
    referenceId: 'CRED-2026-014',
    status: 'VERIFIED',
    issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString(),
    revokedAt: null,
    revocationReason: '',
    metadataHash: crypto.createHash('sha256').update('CRED-2026-014').digest('hex'),
  },
  {
    qrvid: 'QRV-2BC77D',
    subject: 'Legacy permit',
    recordType: 'license',
    issuer: 'Issuer Operations',
    description: 'Historic permit retained for audit traceability.',
    referenceId: 'LIC-2025-122',
    status: 'REVOKED',
    issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 160).toISOString(),
    expiresAt: null,
    revokedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    revocationReason: 'Permit superseded by new issuance.',
    metadataHash: crypto.createHash('sha256').update('LIC-2025-122').digest('hex'),
  },
];

const apiKeys = [
  { name: 'Registry writer', prefix: 'issr_rw_', scope: 'create:records', status: 'active' },
  { name: 'Verifier callback', prefix: 'issr_cb_', scope: 'read:verifications', status: 'active' },
  { name: 'Analytics export', prefix: 'issr_an_', scope: 'read:analytics', status: 'rotating' },
];

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

const createQrSvgDataUri = (qrvid) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220" role="img" aria-label="QR Code for ${qrvid}">
      <rect width="220" height="220" rx="18" fill="#ffffff" />
      <rect x="18" y="18" width="54" height="54" fill="#111827" />
      <rect x="148" y="18" width="54" height="54" fill="#111827" />
      <rect x="18" y="148" width="54" height="54" fill="#111827" />
      <rect x="88" y="88" width="18" height="18" fill="#111827" />
      <rect x="106" y="106" width="18" height="18" fill="#111827" />
      <rect x="124" y="88" width="18" height="18" fill="#111827" />
      <rect x="88" y="124" width="18" height="18" fill="#111827" />
      <rect x="142" y="124" width="18" height="18" fill="#111827" />
      <rect x="124" y="142" width="18" height="18" fill="#111827" />
      <text x="110" y="206" font-size="12" text-anchor="middle" font-family="Arial, sans-serif" fill="#111827">${qrvid}</text>
    </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

const resolveRecordStatus = (record) => {
  if (record.status === 'REVOKED') return 'REVOKED';
  if (record.expiresAt && new Date(record.expiresAt).getTime() < Date.now()) return 'EXPIRED';
  return 'VERIFIED';
};

const toApiRecord = (record) => ({
  qrvid: record.qrvid,
  status: resolveRecordStatus(record),
  issuer: record.issuer,
  subject: record.subject,
  recordType: record.recordType,
  description: record.description,
  referenceId: record.referenceId,
  issued_at: record.issuedAt,
  expires_at: record.expiresAt,
  revoked_at: record.revokedAt,
  revocation_reason: record.revocationReason,
  metadata_hash: record.metadataHash,
  verification_url: `https://verify.qrv.network/${encodeURIComponent(record.qrvid)}`,
  qrCode: createQrSvgDataUri(record.qrvid),
});

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(payload));
};

const serveFile = (res, filePath) => {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendJson(res, 404, { error: 'File not found.' });
      return;
    }

    const extension = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[extension] || 'text/plain; charset=utf-8' });
    res.end(content);
  });
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (error) {
        reject(new Error('Request body must be valid JSON.'));
      }
    });
  });

const getAnalytics = () => {
  const issued = records.length;
  const revoked = records.filter((record) => resolveRecordStatus(record) === 'REVOKED').length;
  const active = issued - revoked;
  const verifications = records.reduce((total, record, index) => total + 20 + index * 7, 0);

  return {
    totals: { issued, active, revoked, verifications },
    trends: [
      { label: '24h scans', value: active * 14 + 12 },
      { label: '7d successful verifications', value: verifications },
      { label: 'Revocation events', value: revoked },
      { label: 'API success rate', value: '99.98%' },
    ],
  };
};

const isPathInside = (base, target) => {
  const relative = path.relative(base, target);
  return !relative.startsWith('..') && !path.isAbsolute(relative);
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const sendHtml = (res, statusCode, html) => {
  res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
};

const renderVerifyLandingPage = () => `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>QR-V Verify</title></head>
  <body style="font-family:Arial,sans-serif;max-width:760px;margin:3rem auto;padding:0 1rem;">
    <h1>QR-V verification</h1>
    <p>Scan a QR code or open <code>https://verify.qrv.network/{QRVID}</code> to verify a record.</p>
    <p>Issuer control plane: <a href="/issuer-qrv">/issuer-qrv</a></p>
  </body>
</html>`;

const renderVerificationPage = (verification) => {
  const palette =
    verification.status === 'VERIFIED'
      ? '#065f46'
      : verification.status === 'REVOKED'
        ? '#991b1b'
        : verification.status === 'EXPIRED'
          ? '#92400e'
          : '#1f2937';

  return `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(verification.qrvid)} · ${verification.status}</title></head>
  <body style="font-family:Arial,sans-serif;max-width:760px;margin:3rem auto;padding:0 1rem;">
    <h1 style="margin-bottom:.5rem;">QR-V verification result</h1>
    <p style="font-size:1.25rem;font-weight:700;color:${palette};margin-top:0">${verification.status}</p>
    <dl style="display:grid;grid-template-columns:max-content 1fr;gap:.5rem 1rem;">
      <dt>QRVID</dt><dd>${escapeHtml(verification.qrvid)}</dd>
      <dt>Issuer</dt><dd>${escapeHtml(verification.issuer || '-')}</dd>
      <dt>Subject</dt><dd>${escapeHtml(verification.subject || '-')}</dd>
      <dt>Issued</dt><dd>${escapeHtml(verification.issued_at || '-')}</dd>
      <dt>Expires</dt><dd>${escapeHtml(verification.expires_at || '-')}</dd>
      <dt>Revoked</dt><dd>${escapeHtml(verification.revoked_at || '-')}</dd>
    </dl>
  </body>
</html>`;
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && (requestUrl.pathname === '/' || requestUrl.pathname === '/issuer-qrv')) {
    serveFile(res, path.join(PUBLIC_DIR, 'index.html'));
    return;
  }

  if (req.method === 'GET' && requestUrl.pathname === '/verify') {
    sendHtml(res, 200, renderVerifyLandingPage());
    return;
  }

  if (req.method === 'GET' && (requestUrl.pathname.startsWith('/src/') || requestUrl.pathname.startsWith('/assets/'))) {
    const baseDir = requestUrl.pathname.startsWith('/src/') ? SRC_DIR : path.join(PUBLIC_DIR, 'assets');
    const relativePath = requestUrl.pathname.replace(/^\/(src|assets)\/?/, '');
    const filePath = path.join(baseDir, relativePath);

    if (!isPathInside(baseDir, filePath)) {
      sendJson(res, 403, { error: 'Forbidden.' });
      return;
    }

    serveFile(res, filePath);
    return;
  }

  if (req.method === 'GET' && requestUrl.pathname === '/api/records') {
    sendJson(res, 200, records.slice().sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt)).map(toApiRecord));
    return;
  }

  if (req.method === 'GET' && requestUrl.pathname === '/api/analytics') {
    sendJson(res, 200, getAnalytics());
    return;
  }

  if (req.method === 'GET' && requestUrl.pathname === '/api/api-keys') {
    sendJson(res, 200, apiKeys);
    return;
  }

  if (req.method === 'GET' && requestUrl.pathname.startsWith('/api/verify/')) {
    const qrvid = decodeURIComponent(requestUrl.pathname.replace('/api/verify/', ''));
    const record = records.find((item) => item.qrvid === qrvid);

    if (!record) {
      sendJson(res, 404, { qrvid, status: 'NOT_FOUND' });
      return;
    }

    sendJson(res, 200, toApiRecord(record));
    return;
  }

  if (req.method === 'GET' && requestUrl.pathname.startsWith('/verify/')) {
    const qrvid = decodeURIComponent(requestUrl.pathname.replace('/verify/', ''));
    const record = records.find((item) => item.qrvid === qrvid);
    const verification = record ? toApiRecord(record) : { qrvid, status: 'NOT_FOUND' };
    sendHtml(res, record ? 200 : 404, renderVerificationPage(verification));
    return;
  }

  if (
    req.method === 'POST' &&
    (requestUrl.pathname === '/api/records' || requestUrl.pathname === '/api/registry/create')
  ) {
    try {
      const payload = await readBody(req);
      const {
        subject,
        assetName,
        recordType,
        issuer,
        description = '',
        referenceId = '',
        expires_at: expiresAt = null,
        metadata_hash: metadataHash,
      } = payload;
      const resolvedSubject = subject || assetName;

      if (!resolvedSubject || !recordType || !issuer) {
        sendJson(res, 400, {
          error: 'subject (or assetName), recordType, and issuer are required.',
        });
        return;
      }

      const record = {
        qrvid: `QRV-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        subject: resolvedSubject,
        recordType,
        issuer,
        description,
        referenceId,
        status: 'VERIFIED',
        issuedAt: new Date().toISOString(),
        expiresAt,
        revokedAt: null,
        revocationReason: '',
        metadataHash: metadataHash || crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex'),
      };

      records.unshift(record);
      sendJson(res, 201, toApiRecord(record));
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return;
  }

  if (
    req.method === 'POST' &&
    (requestUrl.pathname === '/api/revoke' || /^\/api\/records\/[^/]+\/revoke$/.test(requestUrl.pathname))
  ) {
    try {
      const payload = await readBody(req);
      const routeMatch = requestUrl.pathname.match(/^\/api\/records\/([^/]+)\/revoke$/);
      const qrvid = routeMatch ? decodeURIComponent(routeMatch[1]) : payload.qrvid;
      const { reason } = payload;
      const record = records.find((item) => item.qrvid === qrvid);

      if (!record) {
        sendJson(res, 404, { error: 'Record not found.' });
        return;
      }

      if (record.status === 'REVOKED') {
        sendJson(res, 409, { error: 'Record already revoked.' });
        return;
      }

      if (!reason || !String(reason).trim()) {
        sendJson(res, 400, { error: 'A revocation reason is required.' });
        return;
      }

      record.status = 'REVOKED';
      record.revokedAt = new Date().toISOString();
      record.revocationReason = reason;
      sendJson(res, 200, toApiRecord(record));
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return;
  }

  sendJson(res, 404, { error: 'Not found.' });
});

server.listen(PORT, () => {
  console.log(`Issuer Portal backend listening on port ${PORT}`);
});
