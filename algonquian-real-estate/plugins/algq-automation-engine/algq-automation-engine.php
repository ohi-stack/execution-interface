<?php
/**
 * Plugin Name: Algonquian Automation Engine
 * Description: Durable event automation rules, queues, retries, and execution history.
 * Version: 1.0.0
 * Author: Algonquian Real Estate, LLC
 * Author URI: https://algonquianrealestate.com/
 * Plugin URI: https://algonquianrealestate.com/platform/algq-automation-engine/
 * Text Domain: algq-automation-engine
 * Requires at least: 6.4
 * Requires PHP: 7.4
 * License: Proprietary
 * Network: true
 */
if (!defined('ABSPATH')) { exit; }

final class ALGQ_Automation_Engine {
    const VERSION = '1.0.0';
    const SCHEMA_VERSION = '1.0.0';

    public static function init() {
        register_activation_hook(__FILE__, array(__CLASS__, 'activate'));
        add_action('plugins_loaded', array(__CLASS__, 'boot'));
    }

    public static function boot() {
        load_plugin_textdomain('algq-automation-engine', false, dirname(plugin_basename(__FILE__)) . '/languages');
        if (!function_exists('algq_register_plugin')) { add_action('admin_notices', array(__CLASS__, 'dependency_notice')); return; }
        algq_register_plugin(array('slug'=>'algq-automation-engine','version'=>self::VERSION,'platform_version'=>'1.1.0','required_plugins'=>array('algq-platform'),'schema_version'=>self::SCHEMA_VERSION,'health_check'=>array(__CLASS__,'health'),'admin_route'=>'admin.php?page=algq-automation-engine','capabilities'=>array('manage_algq_automation'),'rest_namespaces'=>array('algq/v1')));
    }

    public static function dependency_notice() {
        if (current_user_can('activate_plugins')) { echo '<div class="notice notice-error"><p>' . esc_html__('Algonquian Automation Engine requires Algonquian Real Estate Platform.', 'algq-automation-engine') . '</p></div>'; }
    }

    public static function activate() {
        if (!defined('ALGQ_PLATFORM_VERSION')) { deactivate_plugins(plugin_basename(__FILE__)); return; }
        global $wpdb; require_once ABSPATH . 'wp-admin/includes/upgrade.php'; $c=$wpdb->get_charset_collate();
        $tables=array(
            'automation_rules' => "",
            'automation_rule_versions' => "",
            'automation_jobs' => ", rule_id BIGINT UNSIGNED NOT NULL, job_status VARCHAR(30) NOT NULL DEFAULT 'pending', idempotency_key VARCHAR(100) NOT NULL, attempts SMALLINT UNSIGNED NOT NULL DEFAULT 0, available_at DATETIME NOT NULL, locked_at DATETIME NULL, UNIQUE KEY idempotency_key (idempotency_key), KEY job_status (job_status)",
            'automation_attempts' => "",
            'automation_dead_letter' => "",
        );
        $base="id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, public_uid CHAR(36) NOT NULL, status VARCHAR(30) NOT NULL DEFAULT 'active', created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, created_by BIGINT UNSIGNED NULL, updated_by BIGINT UNSIGNED NULL, record_version BIGINT UNSIGNED NOT NULL DEFAULT 1, deleted_at DATETIME NULL, source_plugin VARCHAR(100) NOT NULL DEFAULT 'algq-automation-engine', related_deal_id BIGINT UNSIGNED NULL";
        foreach($tables as $name=>$extra){ dbDelta("CREATE TABLE {$wpdb->prefix}algq_{$name} ({$base} {$extra}, PRIMARY KEY (id), UNIQUE KEY public_uid (public_uid), KEY related_deal_id (related_deal_id), KEY status (status), KEY created_at (created_at)) {$c};"); }
        update_option('algq_automation_engine_schema_version',self::SCHEMA_VERSION,false);
    }

    public static function health() {
        global $wpdb; $missing=array();
        foreach(array('automation_rules','automation_rule_versions','automation_jobs','automation_attempts','automation_dead_letter') as $table){ if($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s',$wpdb->prefix.'algq_'.$table))!==$wpdb->prefix.'algq_'.$table){$missing[]=$table;} }
        return array('status'=>$missing?'failed':'healthy','missing_tables'=>$missing,'schema_version'=>get_option('algq_automation_engine_schema_version'));
    }
}
ALGQ_Automation_Engine::init();

function algq_automation_enqueue($rule_id, $event, $idempotency_key, $delay = 0) {
    if (!$idempotency_key) { return new WP_Error('algq_missing_idempotency_key',__('An idempotency key is required.','algq-automation-engine')); }
    global $wpdb; $now=current_time('mysql');
    $inserted=$wpdb->insert($wpdb->prefix.'algq_automation_jobs',array('public_uid'=>wp_generate_uuid4(),'status'=>'active','created_at'=>$now,'updated_at'=>$now,'created_by'=>get_current_user_id()?:null,'updated_by'=>get_current_user_id()?:null,'record_version'=>1,'source_plugin'=>sanitize_key($event['plugin']??'unknown'),'related_deal_id'=>isset($event['deal_id'])?absint($event['deal_id']):null,'rule_id'=>absint($rule_id),'job_status'=>'pending','idempotency_key'=>sanitize_text_field($idempotency_key),'attempts'=>0,'available_at'=>gmdate('Y-m-d H:i:s',time()+absint($delay))));
    if (!$inserted && false !== strpos((string)$wpdb->last_error,'Duplicate')) { return (int)$wpdb->get_var($wpdb->prepare("SELECT id FROM {$wpdb->prefix}algq_automation_jobs WHERE idempotency_key=%s",$idempotency_key)); }
    return $inserted ? (int)$wpdb->insert_id : new WP_Error('algq_queue_failed',__('The automation job could not be queued.','algq-automation-engine'));
}
