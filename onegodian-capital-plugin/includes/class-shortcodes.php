<?php

class Onegodian_Capital_Shortcodes {
    public static function register() {
        add_shortcode('onegodian_capital_offerings', [__CLASS__, 'offerings']);
        add_shortcode('onegodian_capital_offering', [__CLASS__, 'offering']);
        add_shortcode('onegodian_investor_dashboard', [__CLASS__, 'investor_dashboard']);
        add_shortcode('onegodian_capital_certificate', [__CLASS__, 'certificate']);
        add_shortcode('onegodian_capital_disclosure', [__CLASS__, 'disclosure']);
    }

    public static function offerings($atts = []) {
        return self::view('public/views/offerings-grid.php', ['atts' => $atts]);
    }

    public static function offering($atts = []) {
        return self::view('public/views/offering-single.php', ['atts' => $atts]);
    }

    public static function investor_dashboard($atts = []) {
        return self::view('public/views/investor-dashboard.php', ['atts' => $atts]);
    }

    public static function certificate($atts = []) {
        return self::view('public/views/certificate-view.php', ['atts' => $atts]);
    }

    public static function disclosure($atts = []) {
        return self::view('public/views/disclosure-consent.php', ['atts' => $atts]);
    }

    private static function view($rel, $context = []) {
        ob_start();
        extract($context, EXTR_SKIP);
        include ONEGODIAN_CAPITAL_PATH . $rel;
        return ob_get_clean();
    }
}
