(function () {
    document.documentElement.classList.add('algq-deal-marketplace-ready');

    document.querySelectorAll('.algq-marketplace-interest').forEach(function (form) {
        form.addEventListener('submit', function () {
            var button = form.querySelector('button[type="submit"]');

            if (button) {
                button.dataset.originalText = button.textContent || '';
                button.textContent = 'Submitting interest…';
                button.disabled = true;
            }
        });
    });
}());
