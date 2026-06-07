<?php
/**
 * Plugin Name: OneGodian Capital Plugin
 * Description: Capital infrastructure bridge with WooCommerce product sync for the OneGodian App ecosystem.
 * Version: 0.3.1
 * Author: OneGodian
 * Text Domain: onegodian-capital
 * Requires at least: 6.4
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'OGC_VERSION', '0.3.1' );
define( 'OGC_FILE', __FILE__ );
define( 'OGC_PATH', plugin_dir_path( __FILE__ ) );
define( 'OGC_URL', plugin_dir_url( __FILE__ ) );
define( 'OGC_REST_NAMESPACE', 'onegodian-capital/v1' );

require_once OGC_PATH . 'includes/class-ogc-product-sync.php';
require_once OGC_PATH . 'includes/class-ogc-admin.php';
require_once OGC_PATH . 'includes/class-ogc-rest.php';
require_once OGC_PATH . 'includes/class-ogc-product-rest.php';
require_once OGC_PATH . 'includes/class-ogc-app-bridge.php';

register_activation_hook(
	__FILE__,
	static function () {
		add_option( 'ogc_app_bridge_key', wp_generate_password( 32, false, false ) );
		add_option( 'ogc_product_sync_enabled', true );
		add_option( 'ogc_product_sync_categories', array() );
		add_option( 'ogc_synced_products', array() );
		add_option( 'ogc_product_sync_log', array() );
		add_option( 'ogc_last_product_sync', null );
		add_option( 'ogc_capital_website_url', 'https://capital.onegodian.com' );
		add_option( 'ogc_app_product_dashboard_url', 'https://app.onegodian.com/capital/products' );
	}
);

add_action(
	'plugins_loaded',
	static function () {
		OGC_Product_Sync::instance();
		OGC_Admin::instance();
		OGC_REST::instance();
		OGC_Product_REST::instance();
		OGC_App_Bridge::instance();
	}
);
