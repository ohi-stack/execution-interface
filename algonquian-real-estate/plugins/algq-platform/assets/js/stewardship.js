document.addEventListener('submit', async (event) => {
  const form = event.target.closest('.algq-service-request');
  if (!form) return;
  event.preventDefault();
  const status = form.querySelector('.algq-form-status');
  const data = Object.fromEntries(new FormData(form));
  data.property_id = Number(data.property_id);
  data.emergency = data.emergency === '1';
  status.textContent = 'Submitting…';
  try {
    const response = await fetch(`${algqStewardship.restUrl}/service-requests`, {
      method: 'POST', credentials: 'same-origin',
      headers: {'Content-Type': 'application/json', 'X-WP-Nonce': algqStewardship.nonce},
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'The request could not be submitted.');
    form.reset(); status.dataset.kind = 'success'; status.textContent = `Request #${result.id} was submitted securely.`;
  } catch (error) {
    status.dataset.kind = 'error'; status.textContent = error.message;
  }
});
