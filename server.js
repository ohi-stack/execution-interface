const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = 3000;
const INDEX_PATH = path.join(__dirname, 'index.html');

const createQrSvgDataUri = (qrvid) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220" role="img" aria-label="QR Code for ${qrvid}">
      <rect width="220" height="220" fill="#ffffff" />
      <rect x="18" y="18" width="54" height="54" fill="#111827" />
      <rect x="148" y="18" width="54" height="54" fill="#111827" />
      <rect x="18" y="148" width="54" height="54" fill="#111827" />
      <rect x="88" y="88" width="18" height="18" fill="#111827" />
      <rect x="106" y="106" width="18" height="18" fill="#111827" />
      <rect x="124" y="88" width="18" height="18" fill="#111827" />
      <rect x="88" y="124" width="18" height="18" fill="#111827" />
      <rect x="142" y="124" width="18" height="18" fill="#111827" />
      <rect x="124" y="142" width="18" height="18" fill="#111827" />
      <text x="110" y="210" font-size="12" text-anchor="middle" font-family="Arial, sans-serif" fill="#111827">${qrvid}</text>
    </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(payload));
};

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/') {
    fs.readFile(INDEX_PATH, (error, content) => {
      if (error) {
        sendJson(res, 500, { error: 'Unable to load index.html.' });
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/registry/create') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const { assetName, recordType, issuer, description } = JSON.parse(body || '{}');

        if (!assetName || !recordType || !issuer || !description) {
          sendJson(res, 400, {
            error: 'assetName, recordType, issuer, and description are required.',
          });
          return;
        }

        const qrvid = `QRV-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

        sendJson(res, 201, {
          qrvid,
          qrCode: createQrSvgDataUri(qrvid),
          assetName,
          recordType,
          issuer,
          description,
        });
      } catch (error) {
        sendJson(res, 400, { error: 'Request body must be valid JSON.' });
      }
    });

    return;
  }

  sendJson(res, 404, { error: 'Not found.' });
});

server.listen(PORT, () => {
  console.log(`Issuer Portal backend listening on port ${PORT}`);
});
