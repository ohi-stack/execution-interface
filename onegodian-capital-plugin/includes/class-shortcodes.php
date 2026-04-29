<?php

if (!defined('ABSPATH')) {
    exit;
}

class Onegodian_Capital_Shortcodes {
    public static function register() {
        add_shortcode('onegodian_capital_offerings', [__CLASS__, 'offerings']);
        add_shortcode('onegodian_capital_offering', [__CLASS__, 'offering']);
        add_shortcode('onegodian_investor_dashboard', [__CLASS__, 'investor_dashboard']);
        add_shortcode('onegodian_capital_certificate', [__CLASS__, 'certificate']);
        add_shortcode('onegodian_capital_disclosure', [__CLASS__, 'disclosure']);
        add_shortcode('onegodian_capital_accept_disclosure', [__CLASS__, 'accept_disclosure']);
    }

    public static function offerings() { return self::view('public/views/offerings-grid.php'); }
    public static function offering() { return self::view('public/views/offering-single.php'); }
    public static function investor_dashboard() { return self::view('public/views/investor-dashboard.php'); }
    public static function certificate() { return self::view('public/views/certificate-view.php'); }
    public static function disclosure() { return self::view('public/views/disclosure-consent.php'); }

    public static function accept_disclosure($atts = []) {
        $atts = shortcode_atts(['offering_id' => 0], $atts, 'onegodian_capital_accept_disclosure');
        $offering_id = absint($atts['offering_id']);

        if (!is_user_logged_in() || $offering_id <= 0) {
            return '<p>' . esc_html__('Disclosure acceptance requires a logged-in member and a valid offering.', 'onegodian-capital') . '</p>';
        }

        if (isset($_POST['onegodian_accept_disclosure_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['onegodian_accept_disclosure_nonce'])), 'onegodian_accept_disclosure')) {
            $version = (string) get_post_meta($offering_id, '_onegodian_disclosure_packet_version', true);
            $acceptance_id = Onegodian_Capital_Disclosures::create_acceptance(get_current_user_id(), $offering_id, $version ?: 'v1');
            if ($acceptance_id > 0) {
                return '<p>' . esc_html__('Disclosure acceptance recorded.', 'onegodian-capital') . '</p>';
            }
        }

        return self::view('public/views/disclosure-consent.php', ['offering_id' => $offering_id]);
    }

    private static function view($rel, $vars = []) {
        if (!empty($vars)) {
            extract($vars, EXTR_SKIP);
        }
        ob_start(); include ONEGODIAN_CAPITAL_PATH . $rel; return ob_get_clean();
    }
}
