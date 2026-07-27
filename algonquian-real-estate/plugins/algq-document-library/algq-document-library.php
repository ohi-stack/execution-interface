<?php
/**
 * Plugin Name: Algonquian Document Library
 * Description: Document metadata, versions, classifications, retention, packages, and relationships.
 * Version: 1.0.0
 * Author: Algonquian Real Estate, LLC
 * Author URI: https://algonquianrealestate.com/
 * Plugin URI: https://algonquianrealestate.com/platform/algq-document-library/
 * Text Domain: algq-document-library
 * Requires at least: 6.4
 * Requires PHP: 7.4
 * License: Proprietary
 * Network: true
 */
if (!defined('ABSPATH')) { exit; }

final class ALGQ_Document_Library {
    const VERSION = '1.0.0';
    const SCHEMA_VERSION = '1.0.0';

    public static function init() {
        register_activation_hook(__FILE__, array(__CLASS__, 'activate'));
        add_action('plugins_loaded', array(__CLASS__, 'boot'));
    }

    public static function boot() {
        load_plugin_textdomain('algq-document-library', false, dirname(plugin_basename(__FILE__)) . '/languages');
        if (!function_exists('algq_register_plugin')) { add_action('admin_notices', array(__CLASS__, 'dependency_notice')); return; }
        algq_register_plugin(array('slug'=>'algq-document-library','version'=>self::VERSION,'platform_version'=>'1.1.0','required_plugins'=>array('algq-platform'),'schema_version'=>self::SCHEMA_VERSION,'health_check'=>array(__CLASS__,'health'),'admin_route'=>'admin.php?page=algq-document-library','capabilities'=>array('manage_algq_documents'),'rest_namespaces'=>array('algq/v1')));
    }

    public static function dependency_notice() {
        if (current_user_can('activate_plugins')) { echo '<div class="notice notice-error"><p>' . esc_html__('Algonquian Document Library requires Algonquian Real Estate Platform.', 'algq-document-library') . '</p></div>'; }
    }

    public static function activate() {
        if (!defined('ALGQ_PLATFORM_VERSION')) { deactivate_plugins(plugin_basename(__FILE__)); return; }
        global $wpdb; require_once ABSPATH . 'wp-admin/includes/upgrade.php'; $c=$wpdb->get_charset_collate();
        $tables=array(
            'documents' => ", title VARCHAR(255) NOT NULL, category VARCHAR(80) NOT NULL, confidentiality VARCHAR(40) NOT NULL DEFAULT 'internal', file_hash CHAR(64) NULL, legal_hold TINYINT(1) NOT NULL DEFAULT 0",
            'document_versions' => "",
            'document_categories' => "",
            'document_relationships' => "",
            'document_permissions' => "",
            'document_packages' => "",
            'document_package_items' => "",
            'document_requests' => "",
        );
        $base="id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, public_uid CHAR(36) NOT NULL, status VARCHAR(30) NOT NULL DEFAULT 'active', created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, created_by BIGINT UNSIGNED NULL, updated_by BIGINT UNSIGNED NULL, record_version BIGINT UNSIGNED NOT NULL DEFAULT 1, deleted_at DATETIME NULL, source_plugin VARCHAR(100) NOT NULL DEFAULT 'algq-document-library', related_deal_id BIGINT UNSIGNED NULL";
        foreach($tables as $name=>$extra){ dbDelta("CREATE TABLE {$wpdb->prefix}algq_{$name} ({$base} {$extra}, PRIMARY KEY (id), UNIQUE KEY public_uid (public_uid), KEY related_deal_id (related_deal_id), KEY status (status), KEY created_at (created_at)) {$c};"); }
        update_option('algq_document_library_schema_version',self::SCHEMA_VERSION,false);
    }

    public static function health() {
        global $wpdb; $missing=array();
        foreach(array('documents','document_versions','document_categories','document_relationships','document_permissions','document_packages','document_package_items','document_requests') as $table){ if($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s',$wpdb->prefix.'algq_'.$table))!==$wpdb->prefix.'algq_'.$table){$missing[]=$table;} }
        return array('status'=>$missing?'failed':'healthy','missing_tables'=>$missing,'schema_version'=>get_option('algq_document_library_schema_version'));
    }
}
ALGQ_Document_Library::init();

function algq_documents_get($document_id) {
    global $wpdb;
    $document=$wpdb->get_row($wpdb->prepare("SELECT * FROM {$wpdb->prefix}algq_documents WHERE (id=%d OR public_uid=%s) AND deleted_at IS NULL",absint($document_id),(string)$document_id));
    if (!$document) { return new WP_Error('algq_document_not_found',__('Document not found.','algq-document-library'),array('status'=>404)); }
    if (!current_user_can('view_algq_documents')) { return new WP_Error('algq_forbidden',__('Document access is not authorized.','algq-document-library'),array('status'=>403)); }
    return $document;
}
