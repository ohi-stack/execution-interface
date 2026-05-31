<?php
/**
 * Plugin Name: Algonquian Deal Intake
 * Description: Production seller lead intake, validation, scoring, tagging, REST API, and CSV workflows for Algonquian Real Estate.
 * Version: 0.3.0
 * Author: Algonquian Real Estate
 * Requires Plugins: algq-core
 * Text Domain: algq-deal-intake
 */

if (!defined('ABSPATH')) {
    exit;
}


function algq_deal_intake_core_available(): bool
{
    if (function_exists('algq_core')) {
        return true;
    }

    add_action('admin_notices', static function (): void {
        echo '<div class="notice notice-error"><p>' . esc_html__('Algonquian Deal Intake requires the Algonquian Core plugin to be active.', 'algq-deal-intake') . '</p></div>';
    });

    return false;
}

define('ALGQ_DEAL_INTAKE_VERSION', '0.3.0');
define('ALGQ_DEAL_INTAKE_FILE', __FILE__);
define('ALGQ_DEAL_INTAKE_DIR', plugin_dir_path(__FILE__));

require_once ALGQ_DEAL_INTAKE_DIR . 'includes/class-algq-deal-intake-validator.php';
require_once ALGQ_DEAL_INTAKE_DIR . 'includes/class-algq-deal-intake-scorer.php';
require_once ALGQ_DEAL_INTAKE_DIR . 'includes/class-algq-deal-intake-repository.php';
require_once ALGQ_DEAL_INTAKE_DIR . 'includes/class-algq-deal-intake-activator.php';
require_once ALGQ_DEAL_INTAKE_DIR . 'includes/class-algq-deal-intake-rest-controller.php';
require_once ALGQ_DEAL_INTAKE_DIR . 'includes/class-algq-deal-intake-csv.php';
require_once ALGQ_DEAL_INTAKE_DIR . 'admin/class-algq-deal-intake-admin.php';
require_once ALGQ_DEAL_INTAKE_DIR . 'public/class-algq-deal-intake-public.php';
require_once ALGQ_DEAL_INTAKE_DIR . 'includes/class-algq-deal-intake-plugin.php';

register_activation_hook(__FILE__, ['ALGQ_Deal_Intake_Activator', 'activate']);

add_action('plugins_loaded', static function (): void {
    if (!algq_deal_intake_core_available()) {
        return;
    }

    ALGQ_Deal_Intake_Plugin::instance()->run();
});
