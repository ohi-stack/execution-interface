<?php
/**
 * Plugin Name: OneGodian Platform Plugin
 * Description: Premium OneGodian infrastructure for connectors, patterns, runtime endpoints, overlays, generated pages, and legacy shortcodes.
 * Version: 1.0.0
 * Author: OneGodian
 * Text Domain: onegodian-platform
 * Requires at least: 6.4
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'ONEGODIAN_PLATFORM_VERSION', '1.0.0' );
define( 'ONEGODIAN_PLATFORM_FILE', __FILE__ );
define( 'ONEGODIAN_PLATFORM_PATH', plugin_dir_path( __FILE__ ) );
define( 'ONEGODIAN_PLATFORM_URL', plugin_dir_url( __FILE__ ) );

require_once ONEGODIAN_PLATFORM_PATH . 'includes/templates/class-og-template-library.php';
require_once ONEGODIAN_PLATFORM_PATH . 'includes/connectors/class-og-connector-registry.php';
require_once ONEGODIAN_PLATFORM_PATH . 'includes/connectors/class-og-connectors.php';
require_once ONEGODIAN_PLATFORM_PATH . 'includes/connectors/class-og-connector-admin.php';
require_once ONEGODIAN_PLATFORM_PATH . 'includes/patterns/class-og-patterns.php';
require_once ONEGODIAN_PLATFORM_PATH . 'includes/navigation-overlays/class-og-navigation-overlays.php';
require_once ONEGODIAN_PLATFORM_PATH . 'includes/class-og-platform.php';

register_activation_hook( __FILE__, array( 'OG_Platform', 'activate' ) );

add_action(
	'plugins_loaded',
	static function () {
		OG_Platform::instance();
	}
);
