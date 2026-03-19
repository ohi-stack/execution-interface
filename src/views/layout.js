const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

export const jsonForHtml = (value) => escapeHtml(JSON.stringify(value, null, 2));

export const renderLayout = ({ pageTitle, body, pageScript = '' }) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(pageTitle)}</title>
    <meta
      name="description"
      content="Registry-backed QR-V™ verification interface for resolving QRVIDs against the QR-V™ Global Verification Network."
    />
    <link rel="stylesheet" href="/css/styles.css" />
    <script defer src="/js/app.js"></script>
  </head>
  <body>
    <div class="page-shell">
      <header class="page-header">
        <p class="eyebrow">QR-V™ Global Verification Network</p>
        <h1>QR-V™ Verification</h1>
        <p class="subtitle">Deterministic registry-backed verification for QR-V identifiers.</p>
      </header>
      ${body}
      <footer class="page-footer">
        <p>Powered by QR-V™ Global Verification Network</p>
      </footer>
    </div>
    ${pageScript}
  </body>
</html>`;

export { escapeHtml };
