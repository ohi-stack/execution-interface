(function () {
    function copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }

        var input = document.createElement('textarea');
        input.value = text;
        input.setAttribute('readonly', 'readonly');
        input.style.position = 'absolute';
        input.style.left = '-9999px';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        return Promise.resolve();
    }

    document.querySelectorAll('.algq-copy-shortcode').forEach(function (button) {
        button.addEventListener('click', function () {
            var shortcode = button.getAttribute('data-shortcode') || '[algq_marketplace]';
            var original = button.textContent || 'Copy shortcode';

            copyText(shortcode).then(function () {
                button.classList.add('is-copied');
                button.textContent = 'Copied ' + shortcode;

                window.setTimeout(function () {
                    button.classList.remove('is-copied');
                    button.textContent = original;
                }, 1800);
            });
        });
    });
}());
