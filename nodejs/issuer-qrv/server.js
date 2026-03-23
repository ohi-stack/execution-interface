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
    assetName: 'Grid export certificate',
    recordType: 'certificate',
    issuer: 'Issuer Operations',
    description: 'Baseline issuance for active energy export assets.',
    referenceId: 'CERT-2026-001',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    revokedAt: null,
    revocationReason: '',
  },
  {
    qrvid: 'QRV-AD921F',
    assetName: 'Installer credential',
    recordType: 'credential',
    issuer: 'Issuer Operations',
    description: 'Credential for approved installation partner.',
    referenceId: 'CRED-2026-014',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    revokedAt: null,
    revocationReason: '',
  },
  {
    qrvid: 'QRV-2BC77D',
    assetName: 'Legacy permit',
    recordType: 'license',
    issuer: 'Issuer Operations',
    description: 'Historic permit retained for audit traceability.',
    referenceId: 'LIC-2025-122',
    status: 'revoked',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 160).toISOString(),
    revokedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    revocationReason: 'Permit superseded by new issuance.',
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

const withQrCode = (record) => ({ ...record, qrCode: createQrSvgDataUri(record.qrvid) });

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
  const revoked = records.filter((record) => record.status === 'revoked').length;
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
    sendJson(res, 200, records.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(withQrCode));
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
      sendJson(res, 404, { error: 'Record not found.' });
      return;
    }

    sendJson(res, 200, withQrCode(record));
    return;
  }

  if (req.method === 'POST' && requestUrl.pathname === '/api/registry/create') {
    try {
      const payload = await readBody(req);
      const { assetName, recordType, issuer, description, referenceId = '' } = payload;

      if (!assetName || !recordType || !issuer || !description) {
        sendJson(res, 400, { error: 'assetName, recordType, issuer, and description are required.' });
        return;
      }

      const record = {
        qrvid: `QRV-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        assetName,
        recordType,
        issuer,
        description,
        referenceId,
        status: 'active',
        createdAt: new Date().toISOString(),
        revokedAt: null,
        revocationReason: '',
      };

      records.unshift(record);
      sendJson(res, 201, withQrCode(record));
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
    return;
  }

  if (req.method === 'POST' && requestUrl.pathname === '/api/revoke') {
    try {
      const payload = await readBody(req);
      const { qrvid, reason } = payload;
      const record = records.find((item) => item.qrvid === qrvid);

      if (!record) {
        sendJson(res, 404, { error: 'Record not found.' });
        return;
      }

      if (record.status === 'revoked') {
        sendJson(res, 409, { error: 'Record already revoked.' });
        return;
      }

      if (!reason || !String(reason).trim()) {
        sendJson(res, 400, { error: 'A revocation reason is required.' });
        return;
      }

      record.status = 'revoked';
      record.revokedAt = new Date().toISOString();
      record.revocationReason = reason;
      sendJson(res, 200, withQrCode(record));
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
