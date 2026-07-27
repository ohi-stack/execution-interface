<?php
/**
 * Plugin Name: Algonquian Real Estate Platform
 * Description: Core modules for the Algonquian Real Estate operating platform.
 * Version: 1.1.0
 * Author: Algonquian Real Estate, LLC
 * Author URI: https://algonquianrealestate.com/
 * Plugin URI: https://algonquianrealestate.com/platform/
 * Text Domain: algq-platform
 * Requires at least: 6.4
 * Requires PHP: 7.4
 * License: Proprietary
 * Network: true
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ALGQ_PLATFORM_FILE', __FILE__);
define('ALGQ_PLATFORM_PATH', plugin_dir_path(__FILE__));
define('ALGQ_PLATFORM_URL', plugin_dir_url(__FILE__));
define('ALGQ_PLATFORM_VERSION', '1.1.0');

require_once ALGQ_PLATFORM_PATH . 'includes/class-algq-platform-core.php';
require_once ALGQ_PLATFORM_PATH . 'modules/trusted-property-contact/class-module.php';
require_once ALGQ_PLATFORM_PATH . 'includes/tenant-management-integration.php';

register_activation_hook(__FILE__, array('ALGQ_Platform_Core', 'activate'));
register_deactivation_hook(__FILE__, array('ALGQ_Platform_Core', 'deactivate'));

ALGQ_Platform_Core::instance();
ALGQ_Trusted_Property_Contact_Module::instance();
