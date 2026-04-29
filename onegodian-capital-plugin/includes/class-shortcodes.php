<?php
class Onegodian_Capital_Shortcodes {
    public static function register() {
        add_shortcode('onegodian_capital_offerings', [__CLASS__, 'offerings']);
        add_shortcode('onegodian_capital_offering', [__CLASS__, 'offering']);
        add_shortcode('onegodian_investor_dashboard', [__CLASS__, 'investor_dashboard']);
        add_shortcode('onegodian_capital_certificate', [__CLASS__, 'certificate']);
        add_shortcode('onegodian_capital_disclosure', [__CLASS__, 'disclosure']);
    }
    public static function offerings() { return self::view('public/views/offerings-grid.php'); }
    public static function offering() { return self::view('public/views/offering-single.php'); }
    public static function investor_dashboard() { return self::view('public/views/investor-dashboard.php'); }
    public static function certificate() { return self::view('public/views/certificate-view.php'); }
    public static function disclosure() { return self::view('public/views/disclosure-consent.php'); }
    private static function view($rel) {
        ob_start(); include ONEGODIAN_CAPITAL_PATH . $rel; return ob_get_clean();
    }
}
