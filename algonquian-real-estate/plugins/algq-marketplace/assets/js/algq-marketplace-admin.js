(function () {
    'use strict';

    var ready = function (callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback, { once: true });
            return;
        }

        callback();
    };

    var copyText = function (text, button) {
        var original = button ? button.textContent : '';
        var complete = function () {
            if (!button) {
                return;
            }

            button.textContent = 'Copied';
            window.setTimeout(function () {
                button.textContent = original || 'Copy';
            }, 1800);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(complete).catch(function () {
                fallbackCopy(text, complete);
            });
            return;
        }

        fallbackCopy(text, complete);
    };

    var fallbackCopy = function (text, callback) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', 'readonly');
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
        } catch (error) {
            // Browsers that block programmatic copy should fail silently.
        }

        document.body.removeChild(textarea);

        if (typeof callback === 'function') {
            callback();
        }
    };

    ready(function () {
        document.documentElement.classList.add('algq-marketplace-admin-ready');

        document.querySelectorAll('[data-algq-cache-clear]').forEach(function (button) {
            button.addEventListener('click', function (event) {
                var message = button.getAttribute('data-confirm-message') || 'Clear marketplace cache now?';

                if (!window.confirm(message)) {
                    event.preventDefault();
                }
            });
        });

        document.querySelectorAll('[data-algq-copy-shortcode]').forEach(function (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                var shortcode = button.getAttribute('data-shortcode') || '';
                var targetSelector = button.getAttribute('data-copy-target');
                var target = targetSelector ? document.querySelector(targetSelector) : null;

                if (!shortcode && target) {
                    shortcode = target.textContent || target.value || '';
                }

                if (shortcode) {
                    copyText(shortcode.trim(), button);
                }
            });
        });

        document.querySelectorAll('[data-algq-doc-toggle]').forEach(function (toggle) {
            toggle.addEventListener('click', function () {
                var panelId = toggle.getAttribute('aria-controls');
                var panel = panelId ? document.getElementById(panelId) : null;
                var card = toggle.closest('.algq-doc-card');
                var expanded = toggle.getAttribute('aria-expanded') === 'true';

                toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');

                if (panel) {
                    panel.hidden = expanded;
                }

                if (card) {
                    card.classList.toggle('is-open', !expanded);
                }
            });
        });
    });
}());
