import { escapeHtml, jsonForHtml, renderLayout } from './layout.js';

export const renderResultView = ({ pageTitle, qrvid, verification, errorSummary, autoVerify, backupReminder }) => renderLayout({
  pageTitle,
  backupReminder,
  body: `<main class="content-wrap">
  <section class="card result-card" data-loading-card>
    <div class="result-heading">
      <div>
        <p class="section-label">Verification Result</p>
        <h2>${escapeHtml(qrvid)}</h2>
      </div>
      <span class="status-badge ${escapeHtml(verification.badgeClass)}">${escapeHtml(verification.statusLabel)}</span>
    </div>

    ${errorSummary ? `<div class="alert-banner">${escapeHtml(errorSummary)}</div>` : ''}

    <div class="result-body" data-result-body>
      ${verification.issuerLogoUrl ? `<div class="logo-wrap"><img src="${escapeHtml(verification.issuerLogoUrl)}" alt="Issuer logo" class="issuer-logo" /></div>` : ''}
      <dl class="metadata-grid mobile-first-grid">
        <div><dt>Issuer</dt><dd>${escapeHtml(verification.issuer || '—')}</dd></div>
        <div><dt>Recipient</dt><dd>${escapeHtml(verification.recipient || '—')}</dd></div>
        <div><dt>Certificate Title</dt><dd>${escapeHtml(verification.certificateTitle || '—')}</dd></div>
        <div><dt>Issue Date</dt><dd>${escapeHtml(verification.issueDate || '—')}</dd></div>
        <div><dt>Timestamp</dt><dd>${escapeHtml(verification.timestamp || '—')}</dd></div>
        <div><dt>Proof Reference</dt><dd>${escapeHtml(verification.proofReference || verification.hash || '—')}</dd></div>
      </dl>

      <div class="actions-row">
        <button type="button" class="secondary-button" data-copy-qrvid data-qrvid="${escapeHtml(qrvid)}">Copy QRVID</button>
        <button type="button" class="secondary-button" data-toggle-json>View raw JSON</button>
      </div>

      <pre class="raw-json" hidden data-raw-json>${jsonForHtml(verification.raw)}</pre>
    </div>
  </section>
</main>`,
  pageScript: `<script>window.__QRV_PORTAL__={autoVerify:${autoVerify ? 'true' : 'false'}};</script>`,
});
