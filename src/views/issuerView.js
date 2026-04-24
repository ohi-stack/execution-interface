import { escapeHtml, renderLayout } from './layout.js';

const qrImageUrl = (verificationUrl) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(verificationUrl)}`;

const recordCard = (record, verifyBaseUrl) => {
  const verificationUrl = `${verifyBaseUrl.replace(/\/$/, '')}/${encodeURIComponent(record.qrvid)}`;

  return `<article class="card" style="margin-top:1rem;">
    <div class="result-heading">
      <div>
        <p class="section-label">${escapeHtml(record.record_type || 'CERTIFICATE')}</p>
        <h3>${escapeHtml(record.certificate_title || record.qrvid)}</h3>
      </div>
      <span class="status-badge ${record.status === 'REVOKED' ? 'badge-revoked' : 'badge-verified'}">${escapeHtml(record.status)}</span>
    </div>
    <dl class="metadata-grid">
      <div><dt>QRVID</dt><dd>${escapeHtml(record.qrvid)}</dd></div>
      <div><dt>Recipient</dt><dd>${escapeHtml(record.recipient || record.subject || '—')}</dd></div>
      <div><dt>Issuer</dt><dd>${escapeHtml(record.issuer || '—')}</dd></div>
      <div><dt>Issued Date</dt><dd>${escapeHtml(record.issued_at_utc || '—')}</dd></div>
      <div><dt>Hash</dt><dd>${escapeHtml(record.hash || record.metadata_hash || '—')}</dd></div>
    </dl>
    <p><a href="${escapeHtml(verificationUrl)}">${escapeHtml(verificationUrl)}</a></p>
    <img alt="QR code for ${escapeHtml(record.qrvid)}" src="${escapeHtml(qrImageUrl(verificationUrl))}" width="220" height="220" />
    ${record.status !== 'REVOKED' ? `<form method="post" action="/issuer/revoke" style="margin-top:1rem;">
      <input type="hidden" name="qrvid" value="${escapeHtml(record.qrvid)}" />
      <input type="hidden" name="reason" value="Issuer-initiated revocation" />
      <button type="submit" class="secondary-button">Revoke</button>
    </form>` : ''}
  </article>`;
};

export const renderIssuerView = ({ records, verifyBaseUrl, error }) => renderLayout({
  pageTitle: 'Issuer Console',
  body: `<main class="content-wrap">
    <section class="card hero-card">
      <div>
        <p class="section-label">issuer-qrv</p>
        <h2>Issue Certificate</h2>
      </div>
      ${error ? `<div class="alert-banner">${escapeHtml(error)}</div>` : ''}
      <form class="verify-form" method="post" action="/issuer/issue">
        <div class="form-row"><input name="qrvid" placeholder="QRV-PROD-CERT-000001 (optional)" /></div>
        <div class="form-row"><input name="certificate_title" placeholder="Certificate Title" required /></div>
        <div class="form-row"><input name="record_type" placeholder="CERTIFICATE" value="CERTIFICATE" required /></div>
        <div class="form-row"><input name="recipient" placeholder="Recipient Name" required /></div>
        <div class="form-row"><input name="issuer" placeholder="Issuer Name" value="ONEGODIAN, LLC" required /></div>
        <div class="form-row"><button type="submit">Issue Certificate</button></div>
      </form>
    </section>
    <section>
      <h2>Records</h2>
      ${records.map((record) => recordCard(record, verifyBaseUrl)).join('')}
    </section>
  </main>`,
});
