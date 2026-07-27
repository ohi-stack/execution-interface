<?php
/**
 * Plugin Name: Algonquian Pipeline CRM
 * Description: Canonical deal lifecycle, pipeline, assignment, task, and activity authority.
 * Version: 1.0.0
 * Author: Algonquian Real Estate, LLC
 * Author URI: https://algonquianrealestate.com/
 * Plugin URI: https://algonquianrealestate.com/platform/algq-pipeline-crm/
 * Text Domain: algq-pipeline-crm
 * Requires at least: 6.4
 * Requires PHP: 7.4
 * License: Proprietary
 * Network: true
 */
if (!defined('ABSPATH')) { exit; }

final class ALGQ_Pipeline_CRM {
    const VERSION = '1.0.0';
    const SCHEMA_VERSION = '1.0.0';

    public static function init() {
        register_activation_hook(__FILE__, array(__CLASS__, 'activate'));
        add_action('plugins_loaded', array(__CLASS__, 'boot'));
    }

    public static function boot() {
        load_plugin_textdomain('algq-pipeline-crm', false, dirname(plugin_basename(__FILE__)) . '/languages');
        if (!function_exists('algq_register_plugin')) { add_action('admin_notices', array(__CLASS__, 'dependency_notice')); return; }
        algq_register_plugin(array('slug'=>'algq-pipeline-crm','version'=>self::VERSION,'platform_version'=>'1.1.0','required_plugins'=>array('algq-platform'),'schema_version'=>self::SCHEMA_VERSION,'health_check'=>array(__CLASS__,'health'),'admin_route'=>'admin.php?page=algq-pipeline-crm','capabilities'=>array('manage_algq_deals'),'rest_namespaces'=>array('algq/v1')));
    }

    public static function dependency_notice() {
        if (current_user_can('activate_plugins')) { echo '<div class="notice notice-error"><p>' . esc_html__('Algonquian Pipeline CRM requires Algonquian Real Estate Platform.', 'algq-pipeline-crm') . '</p></div>'; }
    }

    public static function activate() {
        if (!defined('ALGQ_PLATFORM_VERSION')) { deactivate_plugins(plugin_basename(__FILE__)); return; }
        global $wpdb; require_once ABSPATH . 'wp-admin/includes/upgrade.php'; $c=$wpdb->get_charset_collate();
        $tables=array(
            'deals' => ", deal_number VARCHAR(40) NOT NULL, current_stage VARCHAR(40) NOT NULL DEFAULT 'new_intake', assigned_user_id BIGINT UNSIGNED NULL, property_summary LONGTEXT NULL, source VARCHAR(100) NULL, asking_price DECIMAL(14,2) NULL, UNIQUE KEY deal_number (deal_number)",
            'deal_contacts' => "",
            'deal_properties' => "",
            'deal_stage_history' => "",
            'deal_notes' => "",
            'deal_tasks' => "",
            'deal_relationships' => "",
            'deal_activity' => "",
        );
        $base="id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, public_uid CHAR(36) NOT NULL, status VARCHAR(30) NOT NULL DEFAULT 'active', created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, created_by BIGINT UNSIGNED NULL, updated_by BIGINT UNSIGNED NULL, record_version BIGINT UNSIGNED NOT NULL DEFAULT 1, deleted_at DATETIME NULL, source_plugin VARCHAR(100) NOT NULL DEFAULT 'algq-pipeline-crm', related_deal_id BIGINT UNSIGNED NULL";
        foreach($tables as $name=>$extra){ dbDelta("CREATE TABLE {$wpdb->prefix}algq_{$name} ({$base} {$extra}, PRIMARY KEY (id), UNIQUE KEY public_uid (public_uid), KEY related_deal_id (related_deal_id), KEY status (status), KEY created_at (created_at)) {$c};"); }
        update_option('algq_pipeline_crm_schema_version',self::SCHEMA_VERSION,false);
    }

    public static function health() {
        global $wpdb; $missing=array();
        foreach(array('deals','deal_contacts','deal_properties','deal_stage_history','deal_notes','deal_tasks','deal_relationships','deal_activity') as $table){ if($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s',$wpdb->prefix.'algq_'.$table))!==$wpdb->prefix.'algq_'.$table){$missing[]=$table;} }
        return array('status'=>$missing?'failed':'healthy','missing_tables'=>$missing,'schema_version'=>get_option('algq_pipeline_crm_schema_version'));
    }
}
ALGQ_Pipeline_CRM::init();

function algq_pipeline_get_deal($deal_id) {
    global $wpdb;
    $where = is_numeric($deal_id) ? $wpdb->prepare('id = %d', $deal_id) : $wpdb->prepare('public_uid = %s OR deal_number = %s', $deal_id, $deal_id);
    $deal = $wpdb->get_row("SELECT * FROM {$wpdb->prefix}algq_deals WHERE {$where} AND deleted_at IS NULL");
    return $deal ?: new WP_Error('algq_deal_not_found', __('Deal not found.', 'algq-pipeline-crm'), array('status'=>404));
}

function algq_pipeline_create_deal($data, $idempotency_key) {
    if (!current_user_can('manage_algq_deals') && !doing_action('admin_post_nopriv_algq_deal_intake_public_submit')) { return new WP_Error('algq_forbidden', __('Deal creation is not authorized.', 'algq-pipeline-crm'), array('status'=>403)); }
    if (!$idempotency_key) { return new WP_Error('algq_missing_idempotency_key', __('An idempotency key is required.', 'algq-pipeline-crm')); }
    global $wpdb;
    $existing = $wpdb->get_var($wpdb->prepare("SELECT related_deal_id FROM {$wpdb->prefix}algq_deal_activity WHERE public_uid=%s", $idempotency_key));
    if ($existing) { return algq_pipeline_get_deal($existing); }
    $uuid = wp_generate_uuid4(); $now = current_time('mysql');
    $number = 'ALGQ-' . gmdate('Y') . '-' . strtoupper(substr(str_replace('-', '', $uuid), 0, 8));
    $inserted = $wpdb->insert($wpdb->prefix.'algq_deals', array('public_uid'=>$uuid,'status'=>'active','created_at'=>$now,'updated_at'=>$now,'created_by'=>get_current_user_id()?:null,'updated_by'=>get_current_user_id()?:null,'record_version'=>1,'source_plugin'=>'algq-deal-intake','deal_number'=>$number,'current_stage'=>'new_intake','property_summary'=>wp_json_encode($data['property'] ?? array()),'source'=>sanitize_text_field($data['source'] ?? ''),'asking_price'=>isset($data['asking_price'])?(float)$data['asking_price']:null));
    if (!$inserted) { return new WP_Error('algq_deal_create_failed', __('Deal creation failed.', 'algq-pipeline-crm')); }
    $deal_id=(int)$wpdb->insert_id;
    $wpdb->insert($wpdb->prefix.'algq_deal_activity',array('public_uid'=>sanitize_text_field($idempotency_key),'status'=>'recorded','created_at'=>$now,'updated_at'=>$now,'record_version'=>1,'source_plugin'=>'algq-deal-intake','related_deal_id'=>$deal_id));
    algq_log_event(array('event_name'=>'deal_created','plugin'=>'algq-pipeline-crm','related_deal_id'=>$deal_id,'new_value'=>array('deal_number'=>$number)));
    do_action('algq_deal_created',$deal_id,$uuid);
    return algq_pipeline_get_deal($deal_id);
}
