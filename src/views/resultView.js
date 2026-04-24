import { escapeHtml, jsonForHtml, renderLayout } from './layout.js';

export const renderResultView = ({ pageTitle, qrvid, verification, errorSummary, autoVerify }) => renderLayout({
  pageTitle,
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

    <div class="loading-indicator" data-loading-indicator>
      <span class="spinner" aria-hidden="true"></span>
      <span>Resolving verification record...</span>
    </div>

    <div class="result-body" data-result-body>
      <dl class="metadata-grid">
        <div>
          <dt>Issuer</dt>
          <dd>${escapeHtml(verification.issuer || '—')}</dd>
        </div>
        <div>
          <dt>Record Type</dt>
          <dd>${escapeHtml(verification.recordType || '—')}</dd>
        </div>
        <div>
          <dt>Subject</dt>
          <dd>${escapeHtml(verification.subject || '—')}</dd>
        </div>
        <div>
          <dt>Timestamp</dt>
          <dd>${escapeHtml(verification.timestamp || '—')}</dd>
        </div>
        <div>
          <dt>Hash</dt>
          <dd>${escapeHtml(verification.hash || '—')}</dd>
        </div>
        <div>
          <dt>Message</dt>
          <dd>${escapeHtml(verification.message || 'Verification result available')}</dd>
        </div>
      </dl>

      <div class="actions-row">
        <button type="button" class="secondary-button" data-copy-qrvid data-qrvid="${escapeHtml(qrvid)}">Copy QRVID</button>
        <button type="button" class="secondary-button" data-toggle-json>View raw JSON</button>
      </div>

      <pre class="raw-json" hidden data-raw-json>${jsonForHtml(verification.raw)}</pre>
    </div>
  </section>
</main>`,
  pageScript: `<script>
    window.__QRV_PORTAL__ = {
      autoVerify: ${autoVerify ? 'true' : 'false'}
    };
  </script>`,
});
