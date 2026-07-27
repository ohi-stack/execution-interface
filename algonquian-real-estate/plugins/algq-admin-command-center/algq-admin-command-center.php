<?php
/**
 * Plugin Name: Algonquian Admin Command Center
 * Description: Capability-aware executive reporting, health presentation, alerts, and commands.
 * Version: 1.0.0
 * Author: Algonquian Real Estate, LLC
 * Author URI: https://algonquianrealestate.com/
 * Plugin URI: https://algonquianrealestate.com/platform/algq-admin-command-center/
 * Text Domain: algq-admin-command-center
 * Requires at least: 6.4
 * Requires PHP: 7.4
 * License: Proprietary
 * Network: true
 */
if (!defined('ABSPATH')) { exit; }

final class ALGQ_Admin_Command_Center {
    const VERSION = '1.0.0';
    const SCHEMA_VERSION = '1.0.0';

    public static function init() {
        register_activation_hook(__FILE__, array(__CLASS__, 'activate'));
        add_action('plugins_loaded', array(__CLASS__, 'boot'));
    }

    public static function boot() {
        load_plugin_textdomain('algq-admin-command-center', false, dirname(plugin_basename(__FILE__)) . '/languages');
        if (!function_exists('algq_register_plugin')) { add_action('admin_notices', array(__CLASS__, 'dependency_notice')); return; }
        algq_register_plugin(array('slug'=>'algq-admin-command-center','version'=>self::VERSION,'platform_version'=>'1.1.0','required_plugins'=>array('algq-platform'),'schema_version'=>self::SCHEMA_VERSION,'health_check'=>array(__CLASS__,'health'),'admin_route'=>'admin.php?page=algq-admin-command-center','capabilities'=>array('manage_algq_platform'),'rest_namespaces'=>array('algq/v1')));
    }

    public static function dependency_notice() {
        if (current_user_can('activate_plugins')) { echo '<div class="notice notice-error"><p>' . esc_html__('Algonquian Admin Command Center requires Algonquian Real Estate Platform.', 'algq-admin-command-center') . '</p></div>'; }
    }

    public static function activate() {
        if (!defined('ALGQ_PLATFORM_VERSION')) { deactivate_plugins(plugin_basename(__FILE__)); return; }
        global $wpdb; require_once ABSPATH . 'wp-admin/includes/upgrade.php'; $c=$wpdb->get_charset_collate();
        $tables=array(
            'dashboard_preferences' => "",
            'saved_reports' => "",
            'report_jobs' => "",
            'admin_alerts' => "",
        );
        $base="id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, public_uid CHAR(36) NOT NULL, status VARCHAR(30) NOT NULL DEFAULT 'active', created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, created_by BIGINT UNSIGNED NULL, updated_by BIGINT UNSIGNED NULL, record_version BIGINT UNSIGNED NOT NULL DEFAULT 1, deleted_at DATETIME NULL, source_plugin VARCHAR(100) NOT NULL DEFAULT 'algq-admin-command-center', related_deal_id BIGINT UNSIGNED NULL";
        foreach($tables as $name=>$extra){ dbDelta("CREATE TABLE {$wpdb->prefix}algq_{$name} ({$base} {$extra}, PRIMARY KEY (id), UNIQUE KEY public_uid (public_uid), KEY related_deal_id (related_deal_id), KEY status (status), KEY created_at (created_at)) {$c};"); }
        update_option('algq_admin_command_center_schema_version',self::SCHEMA_VERSION,false);
    }

    public static function health() {
        global $wpdb; $missing=array();
        foreach(array('dashboard_preferences','saved_reports','report_jobs','admin_alerts') as $table){ if($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s',$wpdb->prefix.'algq_'.$table))!==$wpdb->prefix.'algq_'.$table){$missing[]=$table;} }
        return array('status'=>$missing?'failed':'healthy','missing_tables'=>$missing,'schema_version'=>get_option('algq_admin_command_center_schema_version'));
    }
}
ALGQ_Admin_Command_Center::init();
