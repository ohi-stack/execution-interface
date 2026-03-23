import { escapeHtml, renderLayout } from './layout.js';

export const renderIndexView = ({ pageTitle, qrvid }) => renderLayout({
  pageTitle,
  body: `<main class="content-wrap">
  <section class="card hero-card">
    <div>
      <p class="section-label">Verification Resolution Interface</p>
      <h2>Resolve a QRVID</h2>
      <p class="supporting-copy">
        Enter a QR-V identifier to verify the latest registry-backed status from the verification API.
      </p>
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
</main>`,
});
