<?php
/** Shared protected-foundation services. */
if (!defined('ABSPATH')) { exit; }

final class ALGQ_Platform_Core {
    const SCHEMA_VERSION = '1.0.0';
    private static $instance;
    private static $registry = array();

    public static function instance() {
        if (!self::$instance) { self::$instance = new self(); }
        return self::$instance;
    }

    private function __construct() {
        add_action('plugins_loaded', array($this, 'load_textdomain'));
        add_action('admin_notices', array($this, 'dependency_notices'));
        add_action('rest_api_init', array($this, 'register_routes'));
        add_action('init', array($this, 'persist_registry'), 99);
    }

    public function load_textdomain() {
        load_plugin_textdomain('algq-platform', false, dirname(plugin_basename(ALGQ_PLATFORM_FILE)) . '/languages');
    }

    public static function activate() {
        self::install_schema();
        self::install_capabilities();
        ALGQ_Trusted_Property_Contact_Module::activate();
    }

    public static function deactivate() {
        ALGQ_Trusted_Property_Contact_Module::deactivate();
    }

    private static function install_schema() {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $c = $wpdb->get_charset_collate();
        $tables = array(
            'audit_log' => "id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, public_uid CHAR(36) NOT NULL, event_name VARCHAR(120) NOT NULL, plugin VARCHAR(100) NOT NULL, user_id BIGINT UNSIGNED NULL, related_deal_id BIGINT UNSIGNED NULL, related_document_id BIGINT UNSIGNED NULL, request_source VARCHAR(40) NOT NULL, event_status VARCHAR(20) NOT NULL, error_code VARCHAR(100) NULL, previous_value LONGTEXT NULL, new_value LONGTEXT NULL, ip_hash CHAR(64) NULL, created_at DATETIME NOT NULL, PRIMARY KEY (id), UNIQUE KEY public_uid (public_uid), KEY event_name (event_name), KEY related_deal_id (related_deal_id), KEY created_at (created_at)",
            'mail_log' => "id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, public_uid CHAR(36) NOT NULL, module VARCHAR(100) NOT NULL, event_name VARCHAR(120) NOT NULL, recipient_hash CHAR(64) NOT NULL, related_record VARCHAR(100) NULL, template VARCHAR(120) NOT NULL, priority VARCHAR(20) NOT NULL, confidentiality VARCHAR(30) NOT NULL, delivery_status VARCHAR(20) NOT NULL, attempts SMALLINT UNSIGNED NOT NULL DEFAULT 0, error_code VARCHAR(100) NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, PRIMARY KEY (id), UNIQUE KEY public_uid (public_uid), KEY delivery_status (delivery_status)",
            'system_events' => "id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, public_uid CHAR(36) NOT NULL, event_name VARCHAR(120) NOT NULL, component VARCHAR(100) NOT NULL, severity VARCHAR(20) NOT NULL, event_status VARCHAR(20) NOT NULL, context LONGTEXT NULL, created_at DATETIME NOT NULL, PRIMARY KEY (id), UNIQUE KEY public_uid (public_uid), KEY severity (severity)",
            'plugin_registry' => "id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, plugin_slug VARCHAR(100) NOT NULL, plugin_version VARCHAR(30) NOT NULL, platform_version VARCHAR(30) NOT NULL, schema_version VARCHAR(30) NOT NULL, health_status VARCHAR(20) NOT NULL, manifest LONGTEXT NOT NULL, updated_at DATETIME NOT NULL, PRIMARY KEY (id), UNIQUE KEY plugin_slug (plugin_slug)",
            'migrations' => "id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, plugin_slug VARCHAR(100) NOT NULL, migration VARCHAR(100) NOT NULL, applied_at DATETIME NOT NULL, checksum CHAR(64) NULL, PRIMARY KEY (id), UNIQUE KEY migration (plugin_slug, migration)",
            'file_registry' => "id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, public_uid CHAR(36) NOT NULL, storage_key VARCHAR(255) NOT NULL, original_name VARCHAR(255) NOT NULL, mime_type VARCHAR(120) NOT NULL, file_size BIGINT UNSIGNED NOT NULL, file_hash CHAR(64) NOT NULL, access_class VARCHAR(40) NOT NULL, related_deal_id BIGINT UNSIGNED NULL, retention_until DATE NULL, legal_hold TINYINT(1) NOT NULL DEFAULT 0, created_by BIGINT UNSIGNED NULL, created_at DATETIME NOT NULL, deleted_at DATETIME NULL, PRIMARY KEY (id), UNIQUE KEY public_uid (public_uid), UNIQUE KEY storage_key (storage_key), KEY related_deal_id (related_deal_id)",
        );
        foreach ($tables as $name => $definition) {
            dbDelta("CREATE TABLE {$wpdb->prefix}algq_{$name} ({$definition}) {$c};");
        }
        update_option('algq_platform_schema_version', self::SCHEMA_VERSION, false);
    }

    private static function install_capabilities() {
        $caps = array('manage_algq_platform','manage_algq_deals','view_algq_deals','edit_algq_deals','delete_algq_deals','manage_algq_underwriting','approve_algq_underwriting','generate_algq_offers','approve_algq_offers','manage_algq_documents','view_algq_documents','manage_algq_signatures','manage_algq_automation','view_algq_audit_logs','export_algq_reports','manage_algq_email');
        $admin = get_role('administrator');
        if ($admin) { foreach ($caps as $cap) { $admin->add_cap($cap); } }
    }

    public static function register_plugin($manifest) {
        $defaults = array('slug'=>'','version'=>'','platform_version'=>'1.1.0','required_plugins'=>array(),'optional_integrations'=>array(),'schema_version'=>'1.0.0','health_check'=>null,'admin_route'=>'','public_routes'=>array(),'capabilities'=>array(),'scheduled_jobs'=>array(),'rest_namespaces'=>array());
        $manifest = wp_parse_args($manifest, $defaults);
        if (!$manifest['slug'] || isset(self::$registry[$manifest['slug']])) { return false; }
        self::$registry[$manifest['slug']] = $manifest;
        return true;
    }

    public function persist_registry() {
        global $wpdb;
        foreach (self::$registry as $manifest) {
            $health = is_callable($manifest['health_check']) ? call_user_func($manifest['health_check']) : array('status'=>'degraded');
            $wpdb->replace($wpdb->prefix . 'algq_plugin_registry', array('plugin_slug'=>$manifest['slug'],'plugin_version'=>$manifest['version'],'platform_version'=>$manifest['platform_version'],'schema_version'=>$manifest['schema_version'],'health_status'=>sanitize_key($health['status'] ?? 'failed'),'manifest'=>wp_json_encode($manifest),'updated_at'=>current_time('mysql')), array('%s','%s','%s','%s','%s','%s','%s'));
        }
    }

    public function dependency_notices() {
        if (!current_user_can('manage_algq_platform')) { return; }
        foreach (self::$registry as $manifest) {
            foreach ($manifest['required_plugins'] as $required) {
                if (!isset(self::$registry[$required])) { printf('<div class="notice notice-error"><p>%s</p></div>', esc_html(sprintf(__('%1$s requires the protected plugin %2$s.', 'algq-platform'), $manifest['slug'], $required))); }
            }
        }
    }

    public function register_routes() {
        register_rest_route('algq/v1', '/health', array('methods'=>'GET','callback'=>array($this,'health'),'permission_callback'=>function(){ return current_user_can('manage_algq_platform'); }));
    }

    public function health() {
        global $wpdb;
        return rest_ensure_response(array('status'=>'healthy','platform_version'=>ALGQ_PLATFORM_VERSION,'schema_version'=>get_option('algq_platform_schema_version'),'database'=>null !== $wpdb->get_var("SHOW TABLES LIKE '{$wpdb->prefix}algq_plugin_registry'"),'plugins'=>self::$registry));
    }

    public static function log($event) {
        global $wpdb;
        $event = wp_parse_args($event, array('event_name'=>'unknown','plugin'=>'algq-platform','related_deal_id'=>null,'related_document_id'=>null,'request_source'=>'internal','status'=>'success','error_code'=>null,'previous_value'=>null,'new_value'=>null));
        $ip = sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'] ?? ''));
        return false !== $wpdb->insert($wpdb->prefix . 'algq_audit_log', array('public_uid'=>wp_generate_uuid4(),'event_name'=>sanitize_key($event['event_name']),'plugin'=>sanitize_key($event['plugin']),'user_id'=>get_current_user_id() ?: null,'related_deal_id'=>$event['related_deal_id'] ? absint($event['related_deal_id']) : null,'related_document_id'=>$event['related_document_id'] ? absint($event['related_document_id']) : null,'request_source'=>sanitize_key($event['request_source']),'event_status'=>sanitize_key($event['status']),'error_code'=>$event['error_code'] ? sanitize_key($event['error_code']) : null,'previous_value'=>self::safe_json($event['previous_value']),'new_value'=>self::safe_json($event['new_value']),'ip_hash'=>$ip ? hash_hmac('sha256',$ip,wp_salt('auth')) : null,'created_at'=>current_time('mysql')));
    }

    private static function safe_json($value) { return null === $value ? null : wp_json_encode($value); }

    public static function send_mail($message) {
        global $wpdb;
        $message = wp_parse_args($message, array('module'=>'platform','event'=>'general','recipient'=>'','subject'=>'','body'=>'','related_record'=>'','template'=>'default','priority'=>'normal','retry'=>true,'confidentiality'=>'internal'));
        if (!is_email($message['recipient'])) { return new WP_Error('algq_invalid_recipient', __('Invalid email recipient.', 'algq-platform')); }
        $sent = wp_mail($message['recipient'], sanitize_text_field($message['subject']), wp_kses_post($message['body']));
        $wpdb->insert($wpdb->prefix . 'algq_mail_log', array('public_uid'=>wp_generate_uuid4(),'module'=>sanitize_key($message['module']),'event_name'=>sanitize_key($message['event']),'recipient_hash'=>hash_hmac('sha256',strtolower($message['recipient']),wp_salt('auth')),'related_record'=>sanitize_text_field($message['related_record']),'template'=>sanitize_key($message['template']),'priority'=>sanitize_key($message['priority']),'confidentiality'=>sanitize_key($message['confidentiality']),'delivery_status'=>$sent?'sent':'failed','attempts'=>1,'error_code'=>$sent?null:'wp_mail_failed','created_at'=>current_time('mysql'),'updated_at'=>current_time('mysql')));
        return $sent ? true : new WP_Error('algq_mail_failed', __('Mail delivery failed.', 'algq-platform'));
    }
}

function algq_register_plugin($manifest) { return ALGQ_Platform_Core::register_plugin($manifest); }
function algq_log_event($event) { return ALGQ_Platform_Core::log($event); }
function algq_send_mail($message) { return ALGQ_Platform_Core::send_mail($message); }
function algq_get_deal($deal_id) { return function_exists('algq_pipeline_get_deal') ? algq_pipeline_get_deal($deal_id) : new WP_Error('algq_pipeline_unavailable', __('Pipeline CRM is unavailable.', 'algq-platform')); }
function algq_get_deal_status($deal_id) { $deal = algq_get_deal($deal_id); return is_wp_error($deal) ? $deal : $deal->current_stage; }
function algq_get_underwriting_summary($deal_id) { return function_exists('algq_mao_get_approved_summary') ? algq_mao_get_approved_summary($deal_id) : new WP_Error('algq_mao_unavailable', __('MAO Engine is unavailable.', 'algq-platform')); }
function algq_get_document($document_id) { return function_exists('algq_documents_get') ? algq_documents_get($document_id) : new WP_Error('algq_documents_unavailable', __('Document Library is unavailable.', 'algq-platform')); }
