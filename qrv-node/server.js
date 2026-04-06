import express from 'express';

const app = express();
const PORT = Number(process.env.PORT || 3000);
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.qrv.network';

const page = (model) => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>QR-V Verification</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 2rem; }
      .badge { padding: 0.4rem 0.7rem; border-radius: 6px; font-weight: 700; }
      .VERIFIED { background: #daf5e4; color: #0f5132; }
      .REVOKED, .EXPIRED, .NOT_FOUND { background: #fde2e2; color: #842029; }
    </style>
  </head>
  <body>
    <h1>QR-V Public Verification</h1>
    <p><span class="badge ${model.status}">${model.status}</span></p>
    <ul>
      <li><strong>QRVID:</strong> ${model.qrvid ?? '-'}</li>
      <li><strong>Type:</strong> ${model.type ?? '-'}</li>
      <li><strong>Issuer:</strong> ${model.issuer ?? '-'}</li>
      <li><strong>Recipient:</strong> ${model.recipient ?? '-'}</li>
      <li><strong>Certificate Title:</strong> ${model.certificateTitle ?? '-'}</li>
      <li><strong>Hash:</strong> ${model.hash ?? '-'}</li>
      <li><strong>Issued At:</strong> ${model.issuedAt ?? '-'}</li>
    </ul>
  </body>
</html>`;

app.get('/:qrvid', async (req, res) => {
  const { qrvid } = req.params;

  if (!/^QRV-[A-Z]+-\d+$/.test(qrvid)) {
    return res.status(400).send(page({ status: 'NOT_FOUND', qrvid }));
  }

  try {
    const upstream = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/verify/${encodeURIComponent(qrvid)}`);
    const payload = await upstream.json();
    const model = {
      status: payload.status || 'NOT_FOUND',
      qrvid: payload.qrvid || qrvid,
      type: payload.type || payload.record_type,
      issuer: payload.issuer,
      recipient: payload.recipient,
      certificateTitle: payload.certificateTitle,
      hash: payload.hash,
      issuedAt: payload.issuedAt,
    };

    return res.status(upstream.status).send(page(model));
  } catch (error) {
    return res.status(503).send(page({ status: 'NOT_FOUND', qrvid }));
  }
});

app.listen(PORT, () => {
  console.log(`qrv-node listening on ${PORT}`);
});
