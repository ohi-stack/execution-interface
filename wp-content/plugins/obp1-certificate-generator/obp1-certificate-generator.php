<?php
/**
 * Plugin Name: OBP-1 Certificate Generator
 * Description: Production-ready certificate issuance plugin for WordPress/WooCommerce.
 * Version: 1.0.0
 * Author: OBP-1
 * Requires Plugins: woocommerce
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'OBP1_CERT_VERSION', '1.0.0' );
define( 'OBP1_CERT_FILE', __FILE__ );
define( 'OBP1_CERT_PATH', plugin_dir_path( __FILE__ ) );
define( 'OBP1_CERT_URL', plugin_dir_url( __FILE__ ) );

require_once OBP1_CERT_PATH . 'includes/class-obp1-certificate-plugin.php';

register_activation_hook( __FILE__, array( 'OBP1_Certificate_Plugin', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'OBP1_Certificate_Plugin', 'deactivate' ) );

OBP1_Certificate_Plugin::instance();
