<?php
if (!defined('ABSPATH')) {
    exit;
}

$document_types = [
    'Letter of Intent',
    'Purchase Agreement',
    'Seller Financing Term Sheet',
    'Assignment Summary',
];
?>
<div class="algq-offer-generator" data-algq-offer-generator>
    <div class="algq-offer-generator__header">
        <p class="algq-offer-generator__eyebrow">Algonquian Real Estate</p>
        <h2>Offer Generator</h2>
        <p>Create seller-facing offer terms, merge-field previews, and printable summaries from a single shortcode.</p>
    </div>

    <form class="algq-offer-generator__form" method="post">
        <?php wp_nonce_field('algq_offer_generate', 'algq_offer_nonce'); ?>
        <div class="algq-offer-generator__grid">
            <label>Document type
                <select name="document_type">
                    <?php foreach ($document_types as $document_type) : ?>
                        <option value="<?php echo esc_attr($document_type); ?>" <?php selected($inputs['document_type'], $document_type); ?>><?php echo esc_html($document_type); ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Property address <input name="property_address" value="<?php echo esc_attr($inputs['property_address']); ?>" placeholder="123 Main Street" /></label>
            <label>Seller name <input name="seller_name" value="<?php echo esc_attr($inputs['seller_name']); ?>" placeholder="Seller Name" /></label>
            <label>Buyer entity <input name="buyer_entity" value="<?php echo esc_attr($inputs['buyer_entity']); ?>" placeholder="Buyer LLC" /></label>
            <label>Purchase price <input required name="purchase_price" type="number" min="0" step="0.01" value="<?php echo esc_attr((string) $inputs['purchase_price']); ?>" /></label>
            <label>Down payment <input name="down_payment" type="number" min="0" step="0.01" value="<?php echo esc_attr((string) $inputs['down_payment']); ?>" /></label>
            <label>Annual interest rate <input required name="annual_rate" type="number" min="0" step="0.001" value="<?php echo esc_attr((string) $inputs['annual_rate']); ?>" /></label>
            <label>Term (months) <input required name="term_months" type="number" min="1" step="1" value="<?php echo esc_attr((string) $inputs['term_months']); ?>" /></label>
            <label>Target closing date <input name="closing_date" type="date" value="<?php echo esc_attr($inputs['closing_date']); ?>" /></label>
        </div>
        <p class="algq-offer-generator__actions">
            <button type="submit">Generate Offer</button>
            <button type="button" data-algq-print-offer>Print / Save PDF</button>
        </p>
    </form>

    <?php if (!empty($offer)) : ?>
        <section class="algq-offer-generator__results" aria-live="polite">
            <h3><?php echo esc_html($offer['document_type']); ?> Preview</h3>
            <div class="algq-offer-generator__cards">
                <div><strong>Purchase Price</strong><span>$<?php echo esc_html(number_format($offer['purchase_price'], 2)); ?></span></div>
                <div><strong>Down Payment</strong><span>$<?php echo esc_html(number_format($offer['down_payment'], 2)); ?></span></div>
                <div><strong>Financed Amount</strong><span>$<?php echo esc_html(number_format($offer['financed_amount'], 2)); ?></span></div>
                <div><strong>Monthly Payment</strong><span>$<?php echo esc_html(number_format($offer['monthly_payment'], 2)); ?></span></div>
                <div><strong>Total Seller Income</strong><span>$<?php echo esc_html(number_format($offer['seller_total_income'], 2)); ?></span></div>
                <div><strong>Total Interest</strong><span>$<?php echo esc_html(number_format($offer['total_interest'], 2)); ?></span></div>
            </div>
            <div class="algq-offer-generator__merge-preview">
                <h4>Merge-field preview</h4>
                <p><code>{{seller_name}}</code>: <?php echo esc_html($offer['seller_name'] ?: 'Seller Name'); ?></p>
                <p><code>{{buyer_entity}}</code>: <?php echo esc_html($offer['buyer_entity'] ?: 'Buyer Entity'); ?></p>
                <p><code>{{property_address}}</code>: <?php echo esc_html($offer['property_address'] ?: 'Property Address'); ?></p>
                <p><code>{{closing_date}}</code>: <?php echo esc_html($offer['closing_date'] ?: 'TBD'); ?></p>
            </div>
        </section>
    <?php endif; ?>
</div>
