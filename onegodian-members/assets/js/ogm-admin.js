(function () {
  function copyValue(selector) {
    var input = document.querySelector(selector);
    if (!input) {
      return;
    }

    input.focus();
    input.select();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(input.value);
      return;
    }

    document.execCommand('copy');
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('.ogm-copy');
    if (!button) {
      return;
    }

    event.preventDefault();
    copyValue(button.getAttribute('data-copy-target'));
    button.classList.add('is-copied');
    button.textContent = 'Copied';
  });
})();
