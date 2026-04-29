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
        add_action('rest_api_init', ['Onegodian_Capital_REST_API', 'register_routes']);
        add_action('woocommerce_order_status_completed', ['Onegodian_Capital_Instruments', 'handle_paid_order']);
        add_action('woocommerce_payment_complete', ['Onegodian_Capital_Instruments', 'handle_paid_order']);
    }
}
