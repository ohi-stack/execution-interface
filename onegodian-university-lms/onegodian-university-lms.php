<?php
/**
 * Plugin Name: Onegodian University LMS
 * Plugin URI: https://u.onegodian.org
 * Description: First-party LMS plugin for University of Onegodian.
 * Version: 1.0.0
 * Author: Onegodian University
 * Text Domain: onegodian-university-lms
 * Domain Path: /languages
 */

if (! defined('ABSPATH')) {
    exit;
}

if (! defined('OG_LMS_VERSION')) {
    define('OG_LMS_VERSION', '1.0.0');
}

if (! defined('OG_LMS_PLUGIN_FILE')) {
    define('OG_LMS_PLUGIN_FILE', __FILE__);
}

if (! defined('OG_LMS_PLUGIN_PATH')) {
    define('OG_LMS_PLUGIN_PATH', plugin_dir_path(__FILE__));
}

if (! defined('OG_LMS_PLUGIN_URL')) {
    define('OG_LMS_PLUGIN_URL', plugin_dir_url(__FILE__));
}

if (! defined('OG_LMS_TEXT_DOMAIN')) {
    define('OG_LMS_TEXT_DOMAIN', 'onegodian-university-lms');
}

require_once OG_LMS_PLUGIN_PATH . 'includes/class-loader.php';
require_once OG_LMS_PLUGIN_PATH . 'includes/class-plugin.php';

register_activation_hook(__FILE__, ['OG_LMS_Activator', 'activate']);
register_deactivation_hook(__FILE__, ['OG_LMS_Deactivator', 'deactivate']);

function og_lms_run(): void
{
    $plugin = new OG_LMS_Plugin();
    $plugin->run();
}

og_lms_run();
