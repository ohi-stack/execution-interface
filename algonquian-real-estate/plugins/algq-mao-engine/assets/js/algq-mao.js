(function () {
    function formatCurrency(value) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
    }

    document.addEventListener('submit', function (event) {
        var form = event.target.closest('[data-algq-mao-calculator] form');
        if (!form) {
            return;
        }

        event.preventDefault();

        var wrapper = form.closest('[data-algq-mao-calculator]');
        var result = wrapper.querySelector('.algq-mao-result');
        var payload = Object.fromEntries(new FormData(form).entries());

        fetch(window.algqMaoEngine.restUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(function (response) { return response.json(); })
            .then(function (data) {
                result.textContent = 'MAO: ' + formatCurrency(data.maximum_allowable_offer) + ' | Recommended range: ' + formatCurrency(data.offer_low) + ' - ' + formatCurrency(data.offer_high);
            })
            .catch(function () {
                result.textContent = 'Calculation unavailable. Please review the inputs and try again.';
            });
    });
}());
