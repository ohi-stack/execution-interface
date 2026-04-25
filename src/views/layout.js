const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

export const jsonForHtml = (value) => escapeHtml(JSON.stringify(value, null, 2));

export const renderLayout = ({ pageTitle, body, pageScript = '', backupReminder = null }) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(pageTitle)}</title>
    <meta
      name="description"
      content="OneGodian registry-backed verification interface for resolving QRVIDs against the QR-V™ Global Verification Network."
    />
    <link rel="stylesheet" href="/css/styles.css" />
    <script defer src="/js/app.js"></script>
  </head>
  <body>
    <div class="page-shell">
      <header class="page-header">
        <p class="eyebrow">OneGodian • QR-V™ Global Verification Network</p>
        <h1>OneGodian Verification Portal</h1>
        <p class="subtitle">Deterministic registry-backed verification for QR-V identifiers.</p>
        ${backupReminder ? `<p class="backup-banner">${escapeHtml(backupReminder)}</p>` : ''}
        <nav class="top-nav" aria-label="Primary">
          <a href="/">Homepage</a>
          <a href="/pricing">Pricing</a>
          <a href="/book-demo">Book Demo</a>
          <a href="/certificate-verification">Certificate Verification</a>
          <a href="/membership-verification">Membership Verification</a>
        </nav>
      </header>
      ${body}
      <footer class="page-footer">
        <p>Powered by OneGodian infrastructure and the QR-V™ Global Verification Network.</p>
      </footer>
    </div>
    ${pageScript}
  </body>
</html>`;

export { escapeHtml };
