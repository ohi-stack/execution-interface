<?php
/**
 * Plugin Name: Algonquian Core
 * Plugin URI: https://algonquianrealestate.com
 * Description: Platform core for Algonquian Real Estate roles, permissions, shared tables, REST services, settings, activity logging, notifications, licensing, UI primitives, and integration registry.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 * Text Domain: algq-core
 * Domain Path: /languages
 * Requires at least: 6.4
 * Requires PHP: 8.0
 * License: GPL-2.0-or-later
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ALGQ_CORE_VERSION', '0.1.0');
define('ALGQ_CORE_FILE', __FILE__);
define('ALGQ_CORE_DIR', plugin_dir_path(__FILE__));
define('ALGQ_CORE_URL', plugin_dir_url(__FILE__));

require_once ALGQ_CORE_DIR . 'includes/class-algq-core-activator.php';
require_once ALGQ_CORE_DIR . 'includes/class-algq-core-settings.php';
require_once ALGQ_CORE_DIR . 'includes/class-algq-core-activity-logger.php';
require_once ALGQ_CORE_DIR . 'includes/class-algq-core-notifications.php';
require_once ALGQ_CORE_DIR . 'includes/class-algq-core-integrations.php';
require_once ALGQ_CORE_DIR . 'includes/class-algq-core-licensing.php';
require_once ALGQ_CORE_DIR . 'includes/class-algq-core-ui.php';
require_once ALGQ_CORE_DIR . 'includes/class-algq-core-rest-controller.php';
require_once ALGQ_CORE_DIR . 'includes/class-algq-core-plugin.php';

register_activation_hook(__FILE__, ['ALGQ_Core_Activator', 'activate']);
register_deactivation_hook(__FILE__, ['ALGQ_Core_Activator', 'deactivate']);

function algq_core(): ALGQ_Core_Plugin
{
    return ALGQ_Core_Plugin::instance();
}

add_action('plugins_loaded', static function (): void {
    algq_core()->run();
});
