<?php
/**
 * Plugin Name: Algonquian Automation Engine
 * Description: Trigger/action automation, status-based workflows, email notifications, document generation triggers, and closeout workflows.
 * Version: 1.0.0
 * Author: Algonquian Real Estate
 * Text Domain: algq-automation-engine
 */

if (!defined('ABSPATH')) { exit; }

final class ALGQ_Automation_Engine
{
    private const RULES = 'algq_automation_rules';
    private const RUNS = 'algq_automation_runs';
    private const TRIGGERS = ['deal_created', 'status_changed', 'offer_sent', 'buyer_interest', 'funding_committed', 'document_signed', 'deal_closed'];
    private const ACTIONS = ['send_email', 'generate_document', 'create_task', 'update_status', 'notify_admin', 'closeout_workflow'];

    public function __construct()
    {
        add_shortcode('algq_automation_engine', [$this, 'shortcode']);
        add_action('admin_menu', [$this, 'admin_page']);
        add_action('rest_api_init', [$this, 'routes']);
        add_action('algq_automation_trigger', [$this, 'dispatch'], 10, 2);
    }

    public static function activate(): void
    {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset = $wpdb->get_charset_collate();
        dbDelta('CREATE TABLE ' . self::table(self::RULES) . " (id bigint(20) unsigned NOT NULL AUTO_INCREMENT, rule_name varchar(191) NOT NULL, trigger_key varchar(80) NOT NULL, conditions_json longtext NULL, actions_json longtext NOT NULL, is_active tinyint(1) DEFAULT 1, created_at datetime NOT NULL, updated_at datetime NOT NULL, PRIMARY KEY  (id), KEY trigger_key (trigger_key), KEY is_active (is_active)) {$charset};");
        dbDelta('CREATE TABLE ' . self::table(self::RUNS) . " (id bigint(20) unsigned NOT NULL AUTO_INCREMENT, rule_id bigint(20) unsigned NOT NULL, trigger_key varchar(80) NOT NULL, entity_type varchar(80) DEFAULT 'deal', entity_id varchar(80) DEFAULT '', run_status varchar(40) DEFAULT 'queued', run_log longtext NULL, created_at datetime NOT NULL, completed_at datetime NULL, PRIMARY KEY  (id), KEY rule_id (rule_id), KEY trigger_key (trigger_key), KEY run_status (run_status)) {$charset};");
    }

    public function admin_page(): void { add_menu_page(__('Automation Engine', 'algq-automation-engine'), __('Automation Engine', 'algq-automation-engine'), 'manage_options', 'algq-automation-engine', [$this, 'admin_render'], 'dashicons-controls-repeat', 31); }

    public function routes(): void
    {
        register_rest_route('algq/v1', '/automations', ['methods' => 'GET', 'callback' => fn () => rest_ensure_response($this->rules()), 'permission_callback' => fn () => current_user_can('manage_options')]);
        register_rest_route('algq/v1', '/automations/trigger', ['methods' => 'POST', 'callback' => function (WP_REST_Request $request) { return rest_ensure_response($this->dispatch(sanitize_key((string) $request->get_param('trigger_key')), (array) $request->get_param('payload'))); }, 'permission_callback' => fn () => current_user_can('manage_options')]);
    }

    public function shortcode(): string
    {
        if (!current_user_can('manage_options')) { return '<p>Automation access restricted.</p>'; }
        return '<div class="algq-automation-engine"><h2>Automation Engine</h2><p>Triggers: ' . esc_html(implode(', ', self::TRIGGERS)) . '</p><p>Actions: ' . esc_html(implode(', ', self::ACTIONS)) . '</p></div>';
    }

    public function admin_render(): void { echo '<div class="wrap">' . $this->shortcode() . '</div>'; }

    public function dispatch(string $trigger_key, array $payload = []): array
    {
        global $wpdb;
        if (!in_array($trigger_key, self::TRIGGERS, true)) { return ['error' => 'invalid_trigger']; }
        $rules = $wpdb->get_results($wpdb->prepare('SELECT * FROM ' . self::table(self::RULES) . ' WHERE trigger_key = %s AND is_active = 1', $trigger_key), ARRAY_A) ?: [];
        $runs = [];
        foreach ($rules as $rule) {
            $actions = json_decode((string) $rule['actions_json'], true) ?: [];
            $log = $this->execute_actions($actions, $payload);
            $wpdb->insert(self::table(self::RUNS), ['rule_id' => (int) $rule['id'], 'trigger_key' => $trigger_key, 'entity_type' => sanitize_key((string) ($payload['entity_type'] ?? 'deal')), 'entity_id' => sanitize_text_field((string) ($payload['entity_id'] ?? '')), 'run_status' => 'completed', 'run_log' => wp_json_encode($log), 'created_at' => gmdate('Y-m-d H:i:s'), 'completed_at' => gmdate('Y-m-d H:i:s')]);
            $runs[] = (int) $wpdb->insert_id;
        }
        return ['trigger_key' => $trigger_key, 'runs' => $runs];
    }

    private function execute_actions(array $actions, array $payload): array
    {
        $log = [];
        foreach ($actions as $action) {
            $type = sanitize_key((string) ($action['type'] ?? 'notify_admin'));
            if ('send_email' === $type) { wp_mail(get_option('admin_email'), 'Algonquian automation', wp_json_encode($payload)); }
            if ('generate_document' === $type) { do_action('algq_document_generation_requested', $payload); }
            if ('closeout_workflow' === $type) { do_action('algq_deal_closeout_requested', $payload); }
            $log[] = ['action' => $type, 'executed_at' => gmdate('Y-m-d H:i:s')];
        }
        return $log;
    }

    private function rules(): array { global $wpdb; return $wpdb->get_results('SELECT * FROM ' . self::table(self::RULES) . ' ORDER BY updated_at DESC LIMIT 100', ARRAY_A) ?: []; }
    private static function table(string $table): string { global $wpdb; return $wpdb->prefix . $table; }
}
register_activation_hook(__FILE__, ['ALGQ_Automation_Engine', 'activate']);
new ALGQ_Automation_Engine();
