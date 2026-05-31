(function () {
  document.querySelectorAll('[data-algq-print-offer]').forEach((button) => {
    button.addEventListener('click', () => window.print());
  });
}());
