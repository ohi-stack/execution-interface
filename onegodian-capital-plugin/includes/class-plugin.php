<?php

if (!defined('ABSPATH')) {
    exit;
}

require_once ONEGODIAN_CAPITAL_PATH . 'includes/class-post-types.php';
require_once ONEGODIAN_CAPITAL_PATH . 'includes/class-meta-boxes.php';
require_once ONEGODIAN_CAPITAL_PATH . 'includes/class-shortcodes.php';
require_once ONEGODIAN_CAPITAL_PATH . 'includes/class-rest-api.php';
require_once ONEGODIAN_CAPITAL_PATH . 'includes/class-certificates.php';
require_once ONEGODIAN_CAPITAL_PATH . 'includes/class-ledger.php';
require_once ONEGODIAN_CAPITAL_PATH . 'includes/class-disclosures.php';
require_once ONEGODIAN_CAPITAL_PATH . 'includes/class-instruments.php';
require_once ONEGODIAN_CAPITAL_PATH . 'includes/class-woocommerce.php';
require_once ONEGODIAN_CAPITAL_PATH . 'includes/class-permissions.php';
require_once ONEGODIAN_CAPITAL_PATH . 'includes/class-settings.php';
require_once ONEGODIAN_CAPITAL_PATH . 'includes/class-visual-widgets.php';

class Onegodian_Capital_Plugin {
    private static $instance;

    public static function instance() {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function init() {
        add_action('init', ['Onegodian_Capital_Post_Types', 'register']);
        add_action('init', ['Onegodian_Capital_Shortcodes', 'register']);
        add_action('init', ['Onegodian_Capital_Meta_Boxes', 'register_meta']);
        add_action('admin_init', ['Onegodian_Capital_Settings', 'register']);
        add_action('init', ['Onegodian_Capital_Permissions', 'register_caps']);
        add_action('init', ['Onegodian_Capital_WooCommerce', 'register']);
        add_action('init', ['Onegodian_Capital_Visual_Widgets', 'register']);
        add_action('rest_api_init', ['Onegodian_Capital_REST_API', 'register_routes']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_public_assets']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
    }

    public function enqueue_public_assets() {
        wp_enqueue_style('onegodian-capital-public', ONEGODIAN_CAPITAL_URL . 'public/css/onegodian-capital-public.css', [], ONEGODIAN_CAPITAL_VERSION);
        wp_enqueue_style('onegodian-capital-visual-widgets', ONEGODIAN_CAPITAL_URL . 'assets/css/visual-widgets.css', [], ONEGODIAN_CAPITAL_VERSION);
    }

    public function enqueue_admin_assets($hook_suffix) {
        $screen = function_exists('get_current_screen') ? get_current_screen() : null;
        $is_plugin_screen = is_string($hook_suffix) && (strpos($hook_suffix, 'onegodian') !== false || strpos($hook_suffix, 'capital') !== false);
        $is_offering_screen = $screen && isset($screen->post_type) && $screen->post_type === 'onegodian_offering';
        if (!$is_plugin_screen && !$is_offering_screen) {
            return;
        }
        wp_enqueue_style('onegodian-capital-admin', ONEGODIAN_CAPITAL_URL . 'admin/css/onegodian-capital-admin.css', [], ONEGODIAN_CAPITAL_VERSION);
        wp_enqueue_style('onegodian-capital-visual-widgets', ONEGODIAN_CAPITAL_URL . 'assets/css/visual-widgets.css', [], ONEGODIAN_CAPITAL_VERSION);
        add_action('woocommerce_order_status_completed', ['Onegodian_Capital_Instruments', 'handle_paid_order']);
        add_action('woocommerce_payment_complete', ['Onegodian_Capital_Instruments', 'handle_paid_order']);
    }
}
