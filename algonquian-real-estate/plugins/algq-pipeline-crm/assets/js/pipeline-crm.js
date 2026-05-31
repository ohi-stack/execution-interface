(function () {
  'use strict';

  function closestCard(target) {
    return target && target.closest ? target.closest('.algq-pipeline-card') : null;
  }

  function updateCounts(board) {
    board.querySelectorAll('.algq-pipeline-column').forEach(function (column) {
      var count = column.querySelectorAll('.algq-pipeline-card').length;
      var counter = column.querySelector('[data-stage-count]');
      if (counter) {
        counter.textContent = String(count);
      }
    });
  }

  function postStageChange(dealId, stageKey) {
    return fetch(algqPipelineCRM.restUrl + '/deals/' + encodeURIComponent(dealId) + '/stage', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': algqPipelineCRM.nonce
      },
      body: JSON.stringify({ stage_key: stageKey })
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('Stage update failed');
      }
      return response.json();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (typeof algqPipelineCRM === 'undefined') {
      return;
    }

    document.querySelectorAll('[data-algq-pipeline-board]').forEach(function (board) {
      var draggedCard = null;
      var sourceZone = null;

      board.addEventListener('dragstart', function (event) {
        var card = closestCard(event.target);
        if (!card || !algqPipelineCRM.canEdit) {
          event.preventDefault();
          return;
        }

        draggedCard = card;
        sourceZone = card.closest('.algq-pipeline-dropzone');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', card.dataset.dealId);
        card.classList.add('is-dragging');
      });

      board.addEventListener('dragend', function () {
        if (draggedCard) {
          draggedCard.classList.remove('is-dragging');
        }
        board.querySelectorAll('.is-drag-over').forEach(function (zone) {
          zone.classList.remove('is-drag-over');
        });
        draggedCard = null;
        sourceZone = null;
      });

      board.addEventListener('dragover', function (event) {
        var zone = event.target.closest('.algq-pipeline-dropzone');
        if (!zone || !draggedCard || !algqPipelineCRM.canEdit) {
          return;
        }
        event.preventDefault();
        zone.classList.add('is-drag-over');
      });

      board.addEventListener('dragleave', function (event) {
        var zone = event.target.closest('.algq-pipeline-dropzone');
        if (zone) {
          zone.classList.remove('is-drag-over');
        }
      });

      board.addEventListener('drop', function (event) {
        var zone = event.target.closest('.algq-pipeline-dropzone');
        if (!zone || !draggedCard || !algqPipelineCRM.canEdit) {
          return;
        }

        event.preventDefault();
        zone.classList.remove('is-drag-over');

        var dealId = draggedCard.dataset.dealId;
        var newStage = zone.dataset.stageKey;
        var originalZone = sourceZone;
        zone.appendChild(draggedCard);
        updateCounts(board);

        postStageChange(dealId, newStage).catch(function () {
          if (originalZone) {
            originalZone.appendChild(draggedCard);
            updateCounts(board);
          }
          window.alert(algqPipelineCRM.messages.moveFailed);
        });
      });
    });
  });
}());
