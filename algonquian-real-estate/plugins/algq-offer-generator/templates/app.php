<div class="algq-offer-generator" data-algq-offer-generator>
    <h2><?php esc_html_e('Creative Offer Generator', 'algq-offer-generator'); ?></h2>
    <?php if (!empty($message)) : ?><div class="notice notice-success"><p><?php echo esc_html($message); ?></p></div><?php endif; ?>
    <form method="post">
        <?php wp_nonce_field('algq_offer_generate', 'algq_offer_nonce'); ?>
        <div class="algq-offer-grid">
            <label><?php esc_html_e('Template', 'algq-offer-generator'); ?><select name="template_type">
                <option value="loi" <?php selected($template_type, 'loi'); ?>><?php esc_html_e('Letter of Intent', 'algq-offer-generator'); ?></option>
                <option value="purchase_agreement" <?php selected($template_type, 'purchase_agreement'); ?>><?php esc_html_e('Purchase Agreement', 'algq-offer-generator'); ?></option>
                <option value="seller_financing" <?php selected($template_type, 'seller_financing'); ?>><?php esc_html_e('Seller-Financing Offer', 'algq-offer-generator'); ?></option>
            </select></label>
            <label><?php esc_html_e('Deal ID', 'algq-offer-generator'); ?><input name="deal_id" value="<?php echo esc_attr($fields['deal_id']); ?>" /></label>
            <label><?php esc_html_e('Seller Name', 'algq-offer-generator'); ?><input name="seller_name" value="<?php echo esc_attr($fields['seller_name']); ?>" /></label>
            <label><?php esc_html_e('Buyer Entity', 'algq-offer-generator'); ?><input name="buyer_entity" value="<?php echo esc_attr($fields['buyer_entity']); ?>" /></label>
            <label><?php esc_html_e('Property Address', 'algq-offer-generator'); ?><textarea name="property_address"><?php echo esc_textarea($fields['property_address']); ?></textarea></label>
            <label><?php esc_html_e('Price', 'algq-offer-generator'); ?><input required name="price" type="number" min="0" step="0.01" value="<?php echo esc_attr($fields['price']); ?>" /></label>
            <label><?php esc_html_e('Down Payment', 'algq-offer-generator'); ?><input name="down_payment" type="number" min="0" step="0.01" value="<?php echo esc_attr($fields['down_payment']); ?>" /></label>
            <label><?php esc_html_e('Rate', 'algq-offer-generator'); ?><input required name="rate" type="number" min="0" step="0.01" value="<?php echo esc_attr($fields['rate']); ?>" /></label>
            <label><?php esc_html_e('Term (months)', 'algq-offer-generator'); ?><input required name="term" type="number" min="1" step="1" value="<?php echo esc_attr($fields['term']); ?>" /></label>
            <label><?php esc_html_e('Closing Date', 'algq-offer-generator'); ?><input name="closing_date" type="date" value="<?php echo esc_attr($fields['closing_date']); ?>" /></label>
            <label><?php esc_html_e('Contingencies', 'algq-offer-generator'); ?><textarea name="contingencies"><?php echo esc_textarea($fields['contingencies']); ?></textarea></label>
        </div>
        <p><label><input type="checkbox" name="save_version" value="1" /> <?php esc_html_e('Save to version history', 'algq-offer-generator'); ?></label></p>
        <p><button type="submit"><?php esc_html_e('Generate Offer', 'algq-offer-generator'); ?></button> <button type="button" data-algq-print-offer><?php esc_html_e('Print / Save PDF', 'algq-offer-generator'); ?></button></p>
    </form>
    <?php if (!empty($offer)) : ?>
        <div class="algq-offer-grid">
            <div class="algq-offer-card"><strong><?php esc_html_e('Monthly Income', 'algq-offer-generator'); ?></strong><br><?php echo esc_html(number_format($offer['payment'], 2)); ?></div>
            <div class="algq-offer-card"><strong><?php esc_html_e('Lifetime Income', 'algq-offer-generator'); ?></strong><br><?php echo esc_html(number_format($offer['seller_total_income'], 2)); ?></div>
            <div class="algq-offer-card"><strong><?php esc_html_e('Timeline', 'algq-offer-generator'); ?></strong><br><?php echo esc_html((string) count($offer['schedule'])); ?> months</div>
        </div>
        <div class="algq-offer-pdf-source"><?php echo wp_kses_post($document); ?></div>
    <?php endif; ?>
</div>
