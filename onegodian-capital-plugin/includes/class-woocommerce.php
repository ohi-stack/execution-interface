<?php

if (!defined('ABSPATH')) {
    exit;
}

class Onegodian_Capital_WooCommerce {
    public static function register() {
        add_action('admin_notices', [__CLASS__, 'maybe_show_missing_notice']);
    }

    public static function is_active() {
        return class_exists('WooCommerce');
    }

    public static function maybe_show_missing_notice() {
        if (!current_user_can('activate_plugins') || self::is_active()) {
            return;
        }

        echo '<div class="notice notice-warning"><p>';
        echo esc_html__('ONEGODIAN Capital Portal purchase flow requires WooCommerce for paid-order integration. The plugin remains active without WooCommerce.', 'onegodian-capital');
        echo '</p></div>';
    }
}
