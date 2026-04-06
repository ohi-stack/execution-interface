const API_BASE_URL = window.__CONFIG__?.API_BASE_URL || 'https://api.qrv.network';

const form = document.getElementById('issue-form');
const result = document.getElementById('result');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = Object.fromEntries(new FormData(form).entries());
  const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/registry/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    alert('Failed to issue certificate');
    return;
  }

  const data = await response.json();
  document.getElementById('qrvid').textContent = data.qrvid;
  document.getElementById('hash').textContent = data.hash;

  const verifyAnchor = document.getElementById('verifyUrl');
  verifyAnchor.href = data.verifyUrl;
  verifyAnchor.textContent = data.verifyUrl;

  const qrImage = document.getElementById('qrImage');
  qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(data.verifyUrl)}`;

  result.hidden = false;
});
