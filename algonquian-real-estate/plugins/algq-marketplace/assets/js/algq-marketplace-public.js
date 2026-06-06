(function () {
    'use strict';

    var ready = function (callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback, { once: true });
            return;
        }

        callback();
    };

    var showToast = function (message) {
        if (!message) {
            return;
        }

        var toast = document.querySelector('[data-algq-marketplace-toast]');

        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'algq-marketplace-toast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            toast.setAttribute('data-algq-marketplace-toast', '');
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add('is-visible');

        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(function () {
            toast.classList.remove('is-visible');
        }, 2600);
    };

    ready(function () {
        document.documentElement.classList.add('algq-deal-marketplace-ready');

        document.querySelectorAll('[data-algq-marketplace-scroll]').forEach(function (trigger) {
            trigger.addEventListener('click', function (event) {
                var selector = trigger.getAttribute('data-algq-marketplace-scroll');
                var target = selector ? document.querySelector(selector) : null;

                if (!target) {
                    return;
                }

                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        document.querySelectorAll('[data-algq-deal-card]').forEach(function (card) {
            card.addEventListener('click', function (event) {
                var interactive = event.target.closest('a, button, input, textarea, select, label');

                if (interactive) {
                    return;
                }

                card.classList.toggle('is-expanded');
            });
        });

        document.querySelectorAll('[data-algq-interest-form]').forEach(function (form) {
            form.addEventListener('submit', function () {
                var button = form.querySelector('button[type="submit"], button:not([type])');

                if (button) {
                    button.disabled = true;
                    button.setAttribute('aria-busy', 'true');
                    button.dataset.originalText = button.textContent || '';
                    button.textContent = 'Sending interest…';
                }

                showToast('Submitting buyer interest securely.');
            });
        });

        document.querySelectorAll('[data-algq-locked-deal]').forEach(function (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                showToast(button.getAttribute('data-message') || 'Premium deal access requires approval.');
            });
        });
    });
}());
