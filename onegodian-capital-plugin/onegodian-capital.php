<?php
/**
 * Plugin Name: ONEGODIAN Capital Portal
 * Description: Private infrastructure plugin for managing digital records related to private capital instruments.
 * Version: 0.2.1
 * Author: ONEGODIAN
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Text Domain: onegodian-capital
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ONEGODIAN_CAPITAL_VERSION', '0.2.1');
define('ONEGODIAN_CAPITAL_PATH', plugin_dir_path(__FILE__));
define('ONEGODIAN_CAPITAL_URL', plugin_dir_url(__FILE__));

require_once ONEGODIAN_CAPITAL_PATH . 'includes/class-plugin.php';
require_once ONEGODIAN_CAPITAL_PATH . 'includes/class-activator.php';
require_once ONEGODIAN_CAPITAL_PATH . 'includes/class-deactivator.php';

register_activation_hook(__FILE__, ['Onegodian_Capital_Activator', 'activate']);
register_deactivation_hook(__FILE__, ['Onegodian_Capital_Deactivator', 'deactivate']);

Onegodian_Capital_Plugin::instance()->init();
