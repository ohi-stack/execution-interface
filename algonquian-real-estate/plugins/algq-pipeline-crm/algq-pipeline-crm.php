<?php
/**
 * Plugin Name: Algonquian Pipeline CRM
 * Description: Production-ready acquisition lifecycle CRM for managing deals from lead capture through close.
 * Version: 1.0.0
 * Author: Onegodian
 * Text Domain: algq-pipeline-crm
 */

if (!defined('ABSPATH')) {
    exit;
}

define('ALGQ_PIPELINE_CRM_VERSION', '1.0.0');
define('ALGQ_PIPELINE_CRM_FILE', __FILE__);
define('ALGQ_PIPELINE_CRM_DIR', plugin_dir_path(__FILE__));
define('ALGQ_PIPELINE_CRM_URL', plugin_dir_url(__FILE__));

require_once ALGQ_PIPELINE_CRM_DIR . 'includes/class-algq-pipeline-database.php';
require_once ALGQ_PIPELINE_CRM_DIR . 'includes/class-algq-pipeline-activity.php';
require_once ALGQ_PIPELINE_CRM_DIR . 'includes/class-algq-pipeline-activator.php';
require_once ALGQ_PIPELINE_CRM_DIR . 'includes/class-algq-pipeline-board.php';
require_once ALGQ_PIPELINE_CRM_DIR . 'includes/class-algq-pipeline-rest-controller.php';
require_once ALGQ_PIPELINE_CRM_DIR . 'includes/class-algq-pipeline-admin.php';
require_once ALGQ_PIPELINE_CRM_DIR . 'includes/class-algq-pipeline-integrations.php';
require_once ALGQ_PIPELINE_CRM_DIR . 'includes/class-algq-pipeline-crm.php';

register_activation_hook(__FILE__, ['ALGQ_Pipeline_Activator', 'activate']);

add_action('plugins_loaded', static function (): void {
    ALGQ_Pipeline_CRM::instance()->run();
});
