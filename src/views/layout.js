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
      content="Official Onegodian Time educational and display interface backed by canonical onegodian-api data."
    />
    <link rel="stylesheet" href="/css/styles.css" />
    <script defer src="/js/app.js"></script>
  </head>
  <body>
    <div class="page-shell">
      <header class="page-header">
        <p class="eyebrow">Onegodian Time Initiative</p>
        <h1>Onegodian Time</h1>
        <p class="subtitle">Public documentation and display layer using canonical data from onegodian-api.</p>
      </header>
      ${body}
      <footer class="page-footer">
        <p>The public website is documentation and display only. Canonical authority remains onegodian-api.</p>
      </footer>
    </div>
    ${pageScript}
  </body>
</html>`;

export { escapeHtml };
