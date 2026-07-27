<?php
/**
 * Plugin Name: Algonquian PDF & Signature Engine
 * Description: Provider-neutral PDF rendering and electronic-signature workflow authority.
 * Version: 1.0.0
 * Author: Algonquian Real Estate, LLC
 * Author URI: https://algonquianrealestate.com/
 * Plugin URI: https://algonquianrealestate.com/platform/algq-pdf-signature/
 * Text Domain: algq-pdf-signature
 * Requires at least: 6.4
 * Requires PHP: 7.4
 * License: Proprietary
 * Network: true
 */
if (!defined('ABSPATH')) { exit; }

interface ALGQ_Signature_Provider_Interface {
    public function create_request($document, $signers, $options = array());
    public function cancel_request($provider_reference);
    public function validate_webhook($headers, $payload);
    public function parse_webhook($payload);
}

final class ALGQ_PDF_Signature_Engine {
    const VERSION = '1.0.0';
    const SCHEMA_VERSION = '1.0.0';

    public static function init() {
        register_activation_hook(__FILE__, array(__CLASS__, 'activate'));
        add_action('plugins_loaded', array(__CLASS__, 'boot'));
    }

    public static function boot() {
        load_plugin_textdomain('algq-pdf-signature', false, dirname(plugin_basename(__FILE__)) . '/languages');
        if (!function_exists('algq_register_plugin')) { add_action('admin_notices', array(__CLASS__, 'dependency_notice')); return; }
        algq_register_plugin(array('slug'=>'algq-pdf-signature','version'=>self::VERSION,'platform_version'=>'1.1.0','required_plugins'=>array('algq-platform','algq-document-library'),'schema_version'=>self::SCHEMA_VERSION,'health_check'=>array(__CLASS__,'health'),'admin_route'=>'admin.php?page=algq-pdf-signature','capabilities'=>array('manage_algq_signatures'),'rest_namespaces'=>array('algq/v1')));
    }

    public static function dependency_notice() {
        if (current_user_can('activate_plugins')) { echo '<div class="notice notice-error"><p>' . esc_html__('Algonquian PDF & Signature Engine requires Algonquian Real Estate Platform.', 'algq-pdf-signature') . '</p></div>'; }
    }

    public static function activate() {
        if (!defined('ALGQ_PLATFORM_VERSION')) { deactivate_plugins(plugin_basename(__FILE__)); return; }
        global $wpdb; require_once ABSPATH . 'wp-admin/includes/upgrade.php'; $c=$wpdb->get_charset_collate();
        $tables=array(
            'pdf_jobs' => ", source_document_id BIGINT UNSIGNED NOT NULL, job_status VARCHAR(30) NOT NULL DEFAULT 'pending', idempotency_key VARCHAR(100) NOT NULL, UNIQUE KEY idempotency_key (idempotency_key)",
            'pdf_files' => "",
            'signature_requests' => "",
            'signature_signers' => "",
            'signature_events' => "",
            'signature_provider_refs' => "",
        );
        $base="id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, public_uid CHAR(36) NOT NULL, status VARCHAR(30) NOT NULL DEFAULT 'active', created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, created_by BIGINT UNSIGNED NULL, updated_by BIGINT UNSIGNED NULL, record_version BIGINT UNSIGNED NOT NULL DEFAULT 1, deleted_at DATETIME NULL, source_plugin VARCHAR(100) NOT NULL DEFAULT 'algq-pdf-signature', related_deal_id BIGINT UNSIGNED NULL";
        foreach($tables as $name=>$extra){ dbDelta("CREATE TABLE {$wpdb->prefix}algq_{$name} ({$base} {$extra}, PRIMARY KEY (id), UNIQUE KEY public_uid (public_uid), KEY related_deal_id (related_deal_id), KEY status (status), KEY created_at (created_at)) {$c};"); }
        update_option('algq_pdf_signature_schema_version',self::SCHEMA_VERSION,false);
    }

    public static function health() {
        global $wpdb; $missing=array();
        foreach(array('pdf_jobs','pdf_files','signature_requests','signature_signers','signature_events','signature_provider_refs') as $table){ if($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s',$wpdb->prefix.'algq_'.$table))!==$wpdb->prefix.'algq_'.$table){$missing[]=$table;} }
        return array('status'=>$missing?'failed':'healthy','missing_tables'=>$missing,'schema_version'=>get_option('algq_pdf_signature_schema_version'));
    }
}
ALGQ_PDF_Signature_Engine::init();
