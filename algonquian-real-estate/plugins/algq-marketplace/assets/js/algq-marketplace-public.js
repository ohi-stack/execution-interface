(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.algq-marketplace-card').forEach(function (card) {
      card.setAttribute('data-algq-card-ready', 'true');
    });
  });
})();
