<div class="algq-offer-generator">
    <h2>Creative Offer Generator</h2>
    <form method="post">
        <?php wp_nonce_field('algq_offer_generate', 'algq_offer_nonce'); ?>
        <div class="algq-offer-grid">
            <label>Price <input required name="price" type="number" min="0" step="0.01" /></label>
            <label>Rate <input required name="rate" type="number" min="0" step="0.01" /></label>
            <label>Term (months) <input required name="term" type="number" min="1" step="1" /></label>
        </div>
        <p><button type="submit">Generate Offer</button> <button type="button" data-algq-print-offer>Print / Save PDF</button></p>
    </form>
    <?php if (!empty($offer)) : ?>
        <div class="algq-offer-grid">
            <div class="algq-offer-card"><strong>Monthly Income</strong><br><?php echo esc_html(number_format($offer['payment'], 2)); ?></div>
            <div class="algq-offer-card"><strong>Lifetime Income</strong><br><?php echo esc_html(number_format($offer['seller_total_income'], 2)); ?></div>
            <div class="algq-offer-card"><strong>Timeline</strong><br><?php echo esc_html((string) count($offer['schedule'])); ?> months</div>
        </div>
    <?php endif; ?>
</div>
