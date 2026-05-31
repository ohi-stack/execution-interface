(function () {
  const config = window.algqPipelineCRM;
  if (!config) return;

  const post = (action, data) => {
    const body = new URLSearchParams({ action, nonce: config.nonce, ...data });
    return fetch(config.ajaxUrl, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    }).then((response) => response.json());
  };

  document.querySelectorAll('[data-algq-pipeline]').forEach((pipeline) => {
    let draggedCard = null;

    pipeline.addEventListener('dragstart', (event) => {
      const card = event.target.closest('.algq-deal-card');
      if (!card) return;
      draggedCard = card;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', card.dataset.dealId);
      card.classList.add('is-dragging');
    });

    pipeline.addEventListener('dragend', () => {
      if (draggedCard) draggedCard.classList.remove('is-dragging');
      draggedCard = null;
    });

    pipeline.querySelectorAll('[data-dropzone]').forEach((zone) => {
      zone.addEventListener('dragover', (event) => {
        event.preventDefault();
        zone.classList.add('is-over');
      });

      zone.addEventListener('dragleave', () => zone.classList.remove('is-over'));

      zone.addEventListener('drop', (event) => {
        event.preventDefault();
        zone.classList.remove('is-over');
        const dealId = event.dataTransfer.getData('text/plain');
        const stage = zone.dataset.dropzone;
        const card = draggedCard || pipeline.querySelector(`[data-deal-id="${dealId}"]`);
        if (!dealId || !stage || !card) return;

        zone.appendChild(card);
        post('algq_pipeline_move_deal', { deal_id: dealId, stage }).then((payload) => {
          if (!payload.success) throw new Error(payload.data && payload.data.message ? payload.data.message : config.messages.error);
        }).catch((error) => {
          card.insertAdjacentHTML('afterbegin', `<p class="algq-card-error">${error.message}</p>`);
        });
      });
    });

    pipeline.addEventListener('submit', (event) => {
      const noteForm = event.target.closest('.algq-note-form');
      const assignmentForm = event.target.closest('.algq-assignment-form');
      if (!noteForm && !assignmentForm) return;
      event.preventDefault();
      const card = event.target.closest('.algq-deal-card');
      const dealId = card ? card.dataset.dealId : '';

      if (noteForm) {
        const note = noteForm.querySelector('[name="note"]').value.trim();
        if (!note) return;
        post('algq_pipeline_add_note', { deal_id: dealId, note }).then((payload) => {
          if (!payload.success) throw new Error(payload.data && payload.data.message ? payload.data.message : config.messages.error);
          noteForm.reset();
        }).catch((error) => alert(error.message));
      }

      if (assignmentForm) {
        const assignedUserId = assignmentForm.querySelector('[name="assigned_user_id"]').value;
        post('algq_pipeline_assign_deal', { deal_id: dealId, assigned_user_id: assignedUserId }).then((payload) => {
          if (!payload.success) throw new Error(payload.data && payload.data.message ? payload.data.message : config.messages.error);
        }).catch((error) => alert(error.message));
      }
    });
  });
}());
