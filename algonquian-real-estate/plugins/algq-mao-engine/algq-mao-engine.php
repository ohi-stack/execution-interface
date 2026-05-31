<?php
/**
 * Plugin Name: Algonquian MAO Engine
 * Plugin URI: https://algonquianrealestate.com
 * Description: Maximum Allowable Offer calculator and underwriting API for Algonquian Real Estate acquisition workflows.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 * Requires Plugins: algq-core
 * Text Domain: algq-mao-engine
 * Domain Path: /languages
 * Requires at least: 6.4
 * Requires PHP: 8.0
 * License: GPL-2.0-or-later
 */

if (! defined('ABSPATH')) {
    exit;
}

define('ALGQ_MAO_ENGINE_VERSION', '0.1.0');
define('ALGQ_MAO_ENGINE_FILE', __FILE__);
define('ALGQ_MAO_ENGINE_PATH', plugin_dir_path(__FILE__));
define('ALGQ_MAO_ENGINE_URL', plugin_dir_url(__FILE__));

require_once ALGQ_MAO_ENGINE_PATH . 'includes/class-algq-mao-activator.php';
require_once ALGQ_MAO_ENGINE_PATH . 'includes/class-algq-mao-calculator.php';
require_once ALGQ_MAO_ENGINE_PATH . 'includes/class-algq-mao-repository.php';
require_once ALGQ_MAO_ENGINE_PATH . 'includes/class-algq-mao-rest-controller.php';
require_once ALGQ_MAO_ENGINE_PATH . 'admin/class-algq-mao-admin.php';
require_once ALGQ_MAO_ENGINE_PATH . 'public/class-algq-mao-public.php';
require_once ALGQ_MAO_ENGINE_PATH . 'includes/class-algq-mao-plugin.php';

register_activation_hook(__FILE__, array('ALGQ_MAO_Activator', 'activate'));
register_deactivation_hook(__FILE__, array('ALGQ_MAO_Activator', 'deactivate'));

function algq_mao_engine(): ALGQ_MAO_Plugin
{
    static $plugin = null;

    if (null === $plugin) {
        $plugin = new ALGQ_MAO_Plugin();
    }

    return $plugin;
}

add_action('plugins_loaded', static function (): void {
    if (!algq_mao_core_available()) {
        return;
    }

    algq_mao_engine()->run();
});
