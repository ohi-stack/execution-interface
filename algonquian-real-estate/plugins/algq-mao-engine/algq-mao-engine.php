<?php
/**
 * Plugin Name: Algonquian MAO Engine
 * Description: Versioned real-estate underwriting scenarios, formulas, assumptions, approvals, and outputs.
 * Version: 1.0.0
 * Author: Algonquian Real Estate, LLC
 * Author URI: https://algonquianrealestate.com/
 * Plugin URI: https://algonquianrealestate.com/platform/algq-mao-engine/
 * Text Domain: algq-mao-engine
 * Requires at least: 6.4
 * Requires PHP: 7.4
 * License: Proprietary
 * Network: true
 */
if (!defined('ABSPATH')) { exit; }

final class ALGQ_MAO_Engine {
    const VERSION = '1.0.0';
    const SCHEMA_VERSION = '1.0.0';

    public static function init() {
        register_activation_hook(__FILE__, array(__CLASS__, 'activate'));
        add_action('plugins_loaded', array(__CLASS__, 'boot'));
    }

    public static function boot() {
        load_plugin_textdomain('algq-mao-engine', false, dirname(plugin_basename(__FILE__)) . '/languages');
        if (!function_exists('algq_register_plugin')) { add_action('admin_notices', array(__CLASS__, 'dependency_notice')); return; }
        algq_register_plugin(array('slug'=>'algq-mao-engine','version'=>self::VERSION,'platform_version'=>'1.1.0','required_plugins'=>array('algq-platform','algq-pipeline-crm'),'schema_version'=>self::SCHEMA_VERSION,'health_check'=>array(__CLASS__,'health'),'admin_route'=>'admin.php?page=algq-mao-engine','capabilities'=>array('manage_algq_underwriting'),'rest_namespaces'=>array('algq/v1')));
    }

    public static function dependency_notice() {
        if (current_user_can('activate_plugins')) { echo '<div class="notice notice-error"><p>' . esc_html__('Algonquian MAO Engine requires Algonquian Real Estate Platform.', 'algq-mao-engine') . '</p></div>'; }
    }

    public static function activate() {
        if (!defined('ALGQ_PLATFORM_VERSION')) { deactivate_plugins(plugin_basename(__FILE__)); return; }
        global $wpdb; require_once ABSPATH . 'wp-admin/includes/upgrade.php'; $c=$wpdb->get_charset_collate();
        $tables=array(
            'underwriting_scenarios' => ", deal_id BIGINT UNSIGNED NOT NULL, strategy VARCHAR(40) NOT NULL, formula_version VARCHAR(30) NOT NULL, assumption_version VARCHAR(30) NOT NULL, approval_status VARCHAR(30) NOT NULL DEFAULT 'draft', inputs LONGTEXT NOT NULL, outputs LONGTEXT NULL, KEY deal_id (deal_id)",
            'underwriting_inputs' => "",
            'underwriting_outputs' => "",
            'underwriting_formulas' => "",
            'underwriting_assumptions' => "",
            'underwriting_approvals' => "",
        );
        $base="id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, public_uid CHAR(36) NOT NULL, status VARCHAR(30) NOT NULL DEFAULT 'active', created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, created_by BIGINT UNSIGNED NULL, updated_by BIGINT UNSIGNED NULL, record_version BIGINT UNSIGNED NOT NULL DEFAULT 1, deleted_at DATETIME NULL, source_plugin VARCHAR(100) NOT NULL DEFAULT 'algq-mao-engine', related_deal_id BIGINT UNSIGNED NULL";
        foreach($tables as $name=>$extra){ dbDelta("CREATE TABLE {$wpdb->prefix}algq_{$name} ({$base} {$extra}, PRIMARY KEY (id), UNIQUE KEY public_uid (public_uid), KEY related_deal_id (related_deal_id), KEY status (status), KEY created_at (created_at)) {$c};"); }
        update_option('algq_mao_engine_schema_version',self::SCHEMA_VERSION,false);
    }

    public static function health() {
        global $wpdb; $missing=array();
        foreach(array('underwriting_scenarios','underwriting_inputs','underwriting_outputs','underwriting_formulas','underwriting_assumptions','underwriting_approvals') as $table){ if($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s',$wpdb->prefix.'algq_'.$table))!==$wpdb->prefix.'algq_'.$table){$missing[]=$table;} }
        return array('status'=>$missing?'failed':'healthy','missing_tables'=>$missing,'schema_version'=>get_option('algq_mao_engine_schema_version'));
    }
}
ALGQ_MAO_Engine::init();

function algq_mao_get_approved_summary($deal_id) {
    global $wpdb;
    $scenario=$wpdb->get_row($wpdb->prepare("SELECT id,public_uid,deal_id,strategy,formula_version,assumption_version,outputs,updated_at FROM {$wpdb->prefix}algq_underwriting_scenarios WHERE deal_id=%d AND approval_status='approved' AND deleted_at IS NULL ORDER BY updated_at DESC LIMIT 1",absint($deal_id)));
    if (!$scenario) { return new WP_Error('algq_scenario_not_found',__('No approved underwriting scenario was found.','algq-mao-engine'),array('status'=>404)); }
    $scenario->outputs=json_decode($scenario->outputs,true);
    return $scenario;
}
