<?php
/**
 * Plugin Name: QuantumOHI Bridge
 * Description: Server-to-server bridge from WooCommerce order completion events to the QuantumOHI Execution Gateway.
 * Version: 0.1.0
 * Author: QuantumOHI
 */

if (!defined('ABSPATH')) {
    exit;
}

define('QOHI_BRIDGE_VERSION', '0.1.0');
define('QOHI_BRIDGE_PATH', plugin_dir_path(__FILE__));

add_action('plugins_loaded', function (): void {
    require_once QOHI_BRIDGE_PATH . 'includes/class-http-client.php';
    require_once QOHI_BRIDGE_PATH . 'includes/class-admin-settings.php';
    require_once QOHI_BRIDGE_PATH . 'includes/class-certificate-trigger.php';
    require_once QOHI_BRIDGE_PATH . 'includes/class-order-hooks.php';

    QOHI_Bridge_Admin_Settings::init();

    if (!class_exists('WooCommerce')) {
        return;
    }

    $http_client = new QOHI_Bridge_Http_Client();
    $trigger = new QOHI_Bridge_Certificate_Trigger($http_client);
    $order_hooks = new QOHI_Bridge_Order_Hooks($trigger);
    $order_hooks->register();
});
