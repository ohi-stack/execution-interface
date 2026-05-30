<?php
if (!defined('ABSPATH')) {
    exit;
}
?>
<form class="algq-deal-intake" method="post">
    <?php wp_nonce_field('algq_deal_intake_submit', 'algq_deal_intake_nonce'); ?>
    <input type="text" name="algq_website" value="" class="algq-honeypot" tabindex="-1" autocomplete="off" />
    <input type="hidden" name="lead_source" value="<?php echo esc_attr($atts['source'] ?? 'website'); ?>" />
    <?php echo wp_kses_post($message); ?>

    <div class="algq-grid">
        <p><label><?php esc_html_e('Seller Name', 'algq-deal-intake'); ?> <input required name="seller_name" type="text" /></label></p>
        <p><label><?php esc_html_e('Seller Phone', 'algq-deal-intake'); ?> <input required name="seller_phone" type="tel" /></label></p>
        <p><label><?php esc_html_e('Seller Email', 'algq-deal-intake'); ?> <input name="seller_email" type="email" /></label></p>
        <p><label><?php esc_html_e('Asking Price', 'algq-deal-intake'); ?> <input name="asking_price" type="number" min="0" step="0.01" /></label></p>
    </div>

    <p><label><?php esc_html_e('Property Address', 'algq-deal-intake'); ?> <textarea required name="address"></textarea></label></p>
    <p><label><?php esc_html_e('Condition Notes', 'algq-deal-intake'); ?> <textarea name="condition_notes"></textarea></label></p>

    <div class="algq-grid">
        <p><label><?php esc_html_e('Selling Timeline', 'algq-deal-intake'); ?>
            <select name="timeline">
                <option value="unknown"><?php esc_html_e('Not sure', 'algq-deal-intake'); ?></option>
                <option value="asap"><?php esc_html_e('ASAP', 'algq-deal-intake'); ?></option>
                <option value="30_days"><?php esc_html_e('Within 30 days', 'algq-deal-intake'); ?></option>
                <option value="90_days"><?php esc_html_e('Within 90 days', 'algq-deal-intake'); ?></option>
            </select>
        </label></p>
        <p><label><?php esc_html_e('Occupancy', 'algq-deal-intake'); ?>
            <select name="occupancy">
                <option value="unknown"><?php esc_html_e('Unknown', 'algq-deal-intake'); ?></option>
                <option value="owner"><?php esc_html_e('Owner occupied', 'algq-deal-intake'); ?></option>
                <option value="tenant"><?php esc_html_e('Tenant occupied', 'algq-deal-intake'); ?></option>
                <option value="vacant"><?php esc_html_e('Vacant', 'algq-deal-intake'); ?></option>
            </select>
        </label></p>
        <p><label><?php esc_html_e('Repairs Needed', 'algq-deal-intake'); ?>
            <select name="repairs_needed">
                <option value="unknown"><?php esc_html_e('Unknown', 'algq-deal-intake'); ?></option>
                <option value="none"><?php esc_html_e('None', 'algq-deal-intake'); ?></option>
                <option value="cosmetic"><?php esc_html_e('Cosmetic', 'algq-deal-intake'); ?></option>
                <option value="major"><?php esc_html_e('Major repairs', 'algq-deal-intake'); ?></option>
            </select>
        </label></p>
        <p><label><?php esc_html_e('Property Tags', 'algq-deal-intake'); ?> <input name="property_tags" type="text" placeholder="probate, vacant, rental" /></label></p>
    </div>

    <p><label><?php esc_html_e('Why are you considering selling?', 'algq-deal-intake'); ?> <textarea name="motivation_reason"></textarea></label></p>
    <p><button type="submit"><?php esc_html_e('Submit Deal', 'algq-deal-intake'); ?></button></p>
</form>
