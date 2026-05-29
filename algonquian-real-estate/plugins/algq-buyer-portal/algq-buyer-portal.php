<?php
/**
 * Plugin Name: Algonquian Buyer Portal
 * Description: Buyer registration, profile fields, NDA acceptance, downloads, and interest tracking foundations.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 */

if (!defined('ABSPATH')) {
    exit;
}

add_shortcode('algq_buyer_portal', function (): string {
    if (!is_user_logged_in()) {
        return '<div class="algq-buyer-login"><p>Please log in or register to access buyer deals.</p>' . wp_login_form(['echo' => false]) . '</div>';
    }

    $user_id = get_current_user_id();
    if ('POST' === ($_SERVER['REQUEST_METHOD'] ?? '') && isset($_POST['algq_buyer_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['algq_buyer_nonce'])), 'algq_buyer_profile')) {
        update_user_meta($user_id, 'algq_markets', sanitize_text_field(wp_unslash($_POST['markets'] ?? '')));
        update_user_meta($user_id, 'algq_cash_available', (float) ($_POST['cash_available'] ?? 0));
        update_user_meta($user_id, 'algq_buy_box', sanitize_textarea_field(wp_unslash($_POST['buy_box'] ?? '')));
        update_user_meta($user_id, 'algq_property_types', sanitize_text_field(wp_unslash($_POST['property_types'] ?? '')));
        update_user_meta($user_id, 'algq_nda_accepted', !empty($_POST['nda_accepted']) ? 'yes' : 'no');
    }

    ob_start();
    ?>
    <form class="algq-buyer-profile" method="post">
        <?php wp_nonce_field('algq_buyer_profile', 'algq_buyer_nonce'); ?>
        <p><label>Markets <input name="markets" value="<?php echo esc_attr(get_user_meta($user_id, 'algq_markets', true)); ?>" /></label></p>
        <p><label>Cash Available <input name="cash_available" type="number" min="0" step="0.01" value="<?php echo esc_attr(get_user_meta($user_id, 'algq_cash_available', true)); ?>" /></label></p>
        <p><label>Buy Box <textarea name="buy_box"><?php echo esc_textarea(get_user_meta($user_id, 'algq_buy_box', true)); ?></textarea></label></p>
        <p><label>Property Types <input name="property_types" value="<?php echo esc_attr(get_user_meta($user_id, 'algq_property_types', true)); ?>" /></label></p>
        <p><label><input name="nda_accepted" type="checkbox" value="1" <?php checked(get_user_meta($user_id, 'algq_nda_accepted', true), 'yes'); ?> /> NDA accepted</label></p>
        <p><button type="submit">Save Profile</button></p>
    </form>
    <div class="algq-interest-tracking">Interest stages: Interested, Requested Call, Offer Submitted, Assigned.</div>
    <?php
    return (string) ob_get_clean();
});
