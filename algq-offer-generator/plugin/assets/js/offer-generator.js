(function () {
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-algq-print-offer]').forEach(function (button) {
      button.addEventListener('click', function () {
        window.print();
      });
    });
  });
})();
