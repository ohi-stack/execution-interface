<?php
/**
 * Plugin Name: Algonquian Real Estate Platform
 * Description: Core modules for the Algonquian Real Estate operating platform.
 * Version: 1.1.0
 * Author: Algonquian Real Estate, LLC
 * Text Domain: algq-platform
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ALGQ_PLATFORM_FILE', __FILE__);
define('ALGQ_PLATFORM_PATH', plugin_dir_path(__FILE__));
define('ALGQ_PLATFORM_URL', plugin_dir_url(__FILE__));

require_once ALGQ_PLATFORM_PATH . 'modules/trusted-property-contact/class-module.php';
require_once ALGQ_PLATFORM_PATH . 'includes/tenant-management-integration.php';

register_activation_hook(__FILE__, array('ALGQ_Trusted_Property_Contact_Module', 'activate'));
register_deactivation_hook(__FILE__, array('ALGQ_Trusted_Property_Contact_Module', 'deactivate'));

ALGQ_Trusted_Property_Contact_Module::instance();
