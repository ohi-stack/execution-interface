(function () {
  const form = document.getElementById('og-lead-form');
  if (!form || !window.ogLeadForm) {
    return;
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const payload = new FormData(form);
    payload.append('action', 'og_submit_lead');
    payload.append('nonce', ogLeadForm.nonce);

    const response = await fetch(ogLeadForm.ajaxUrl, {
      method: 'POST',
      body: payload,
      credentials: 'same-origin'
    });

    const data = await response.json();
    if (data.success) {
      form.reset();
    }
  });
})();
