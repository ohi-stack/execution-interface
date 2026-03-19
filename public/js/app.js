const form = document.querySelector('[data-verify-form]');
const rawJson = document.querySelector('[data-raw-json]');
const toggleJsonButton = document.querySelector('[data-toggle-json]');
const copyButton = document.querySelector('[data-copy-qrvid]');
const loadingIndicator = document.querySelector('[data-loading-indicator]');
const resultBody = document.querySelector('[data-result-body]');

if (form) {
  form.addEventListener('submit', () => {
    if (loadingIndicator) {
      loadingIndicator.style.display = 'inline-flex';
    }
  });
}

if (toggleJsonButton && rawJson) {
  toggleJsonButton.addEventListener('click', () => {
    const isHidden = rawJson.hasAttribute('hidden');

    if (isHidden) {
      rawJson.removeAttribute('hidden');
      toggleJsonButton.textContent = 'Hide raw JSON';
      return;
    }

    rawJson.setAttribute('hidden', 'hidden');
    toggleJsonButton.textContent = 'View raw JSON';
  });
}

if (copyButton) {
  copyButton.addEventListener('click', async () => {
    const qrvid = copyButton.getAttribute('data-qrvid');

    try {
      await navigator.clipboard.writeText(qrvid);
      copyButton.textContent = 'Copied';
      setTimeout(() => {
        copyButton.textContent = 'Copy QRVID';
      }, 1500);
    } catch (_error) {
      copyButton.textContent = 'Copy failed';
    }
  });
}

if (window.__QRV_PORTAL__?.autoVerify && loadingIndicator && resultBody) {
  loadingIndicator.style.display = 'none';
  resultBody.style.display = 'block';
}
