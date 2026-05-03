<?php

if (!defined('ABSPATH')) {
    exit;
}

class Onegodian_Capital_WooCommerce {
    public static function register() {
        add_action('admin_notices', [__CLASS__, 'maybe_show_missing_notice']);

        if (!self::is_active()) {
            return;
        }

        add_filter('comments_open', [__CLASS__, 'maybe_disable_product_comments'], 10, 2);
        add_filter('pings_open', [__CLASS__, 'maybe_disable_product_comments'], 10, 2);
        add_action('admin_notices', [__CLASS__, 'maybe_show_capital_product_admin_notice']);
        add_action('woocommerce_single_product_summary', [__CLASS__, 'render_capital_product_frontend_notice'], 6);
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

    public static function is_capital_product($product_id) {
        $product_id = absint($product_id);
        if ($product_id <= 0) {
            return false;
        }

        $offering_id = get_post_meta($product_id, '_onegodian_capital_offering_id', true);
        return !empty($offering_id);
    }

    public static function maybe_disable_product_comments($open, $post_id) {
        if (get_post_type($post_id) !== 'product') {
            return $open;
        }

        if (!self::is_capital_product($post_id)) {
            return $open;
        }

        return false;
    }

    public static function maybe_show_capital_product_admin_notice() {
        if (!is_admin() || !current_user_can('edit_products')) {
            return;
        }

        $screen = function_exists('get_current_screen') ? get_current_screen() : null;
        if (!$screen || $screen->id !== 'product' || $screen->base !== 'post') {
            return;
        }

        $product_id = isset($_GET['post']) ? absint(wp_unslash($_GET['post'])) : 0;
        if (!self::is_capital_product($product_id)) {
            return;
        }

        echo '<div class="notice notice-warning"><p>';
        echo esc_html__('This product is linked to a ONEGODIAN Capital Offering and should be used for checkout only. Public offering presentation should occur through Capital Portal pages and disclosure-backed views.', 'onegodian-capital');
        echo '</p></div>';
    }

    public static function render_capital_product_frontend_notice() {
        if (!is_product()) {
            return;
        }

        global $product;
        if (!$product || !self::is_capital_product($product->get_id())) {
            return;
        }

        echo '<div class="woocommerce-info onegodian-capital-product-notice">';
        echo esc_html__('This checkout item is connected to a Capital Offering record. Review the official Capital Offering and disclosure page before checkout.', 'onegodian-capital');
        echo '</div>';
    }

    /**
     * Returns recommended WooCommerce configuration defaults for capital-linked products.
     *
     * Filter hook: onegodian_capital_product_recommended_settings
     */
    public static function get_recommended_product_settings() {
        $settings = [
            'catalog_visibility' => 'hidden',
            'reviews_enabled' => false,
            'recommended_category' => __('Capital Test Products', 'onegodian-capital'),
            'content_guidance' => __('Avoid investment, yield, or guarantee language in product descriptions.', 'onegodian-capital'),
        ];

        return apply_filters('onegodian_capital_product_recommended_settings', $settings);
    }
}
