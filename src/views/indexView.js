import { escapeHtml, renderLayout } from './layout.js';

export const renderIndexView = ({ pageTitle, qrvid, backupReminder }) => renderLayout({
  pageTitle,
  backupReminder,
  body: `<main class="content-wrap">
  <section class="card hero-card">
    <div>
      <p class="section-label">OneGodian Verification Resolution Interface</p>
      <h2>Trust every QR-V verification decision.</h2>
      <p class="supporting-copy">
        Resolve QRVIDs against the registry-backed API, inspect status metadata, and navigate the
        OneGodian system architecture used for deterministic verification.
      </p>
      <div class="actions-row cta-row">
        <a class="button-link" href="/system-architecture">View Architecture</a>
        <a class="button-link secondary-button" href="/health">System Health</a>
      </div>
    </div>

    <form class="verify-form" method="post" action="/verify" data-verify-form>
      <label for="qrvid" class="form-label">QRVID</label>
      <div class="form-row">
        <input
          id="qrvid"
          name="qrvid"
          type="text"
          inputmode="text"
          autocomplete="off"
          autocapitalize="characters"
          spellcheck="false"
          placeholder="QRV-123456789"
          value="${escapeHtml(qrvid)}"
          aria-describedby="qrvid-hint"
          required
        />
        <button type="submit">Verify</button>
      </div>
      <p id="qrvid-hint" class="field-hint">Accepted format: <span>QRV-123456789</span></p>
    </form>
  </section>

  <section class="card architecture-overview">
    <p class="section-label">System Overview</p>
    <h3>Verification control plane and data path</h3>
    <div class="metadata-grid architecture-grid">
      <div><dt>Edge + UI</dt><dd>Landing page, verification flow, and deterministic result rendering.</dd></div>
      <div><dt>API Layer</dt><dd>/api/v1 records and /api/omos governance endpoints.</dd></div>
      <div><dt>Policy + Governance</dt><dd>Runtime schema validation, role policy enforcement, and alignment checks.</dd></div>
      <div><dt>Audit + Health</dt><dd>Health endpoint, request logs, and verification status telemetry.</dd></div>
    </div>
  </section>
</main>`,
});
