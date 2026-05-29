<?php
/**
 * Plugin Name: Algonquian Pipeline CRM
 * Description: Deal Kanban board, stage movement foundation, and activity logging.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Pipeline_CRM
{
    private const ACTIVITY_TABLE = 'algq_activity_log';
    private const STAGES = ['Lead Captured', 'Underwriting', 'Offer Sent', 'Under Contract', 'Buyer Assigned', 'Closed'];

    public function __construct()
    {
        add_shortcode('algq_pipeline_crm', [$this, 'render_board']);
        add_action('wp_ajax_algq_move_deal_stage', [$this, 'move_stage']);
    }

    public static function activate(): void
    {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta("CREATE TABLE {$wpdb->prefix}" . self::ACTIVITY_TABLE . " (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            deal_id varchar(32) NOT NULL,
            activity_type varchar(64) NOT NULL,
            activity_note text NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY deal_id (deal_id)
        ) {$wpdb->get_charset_collate()};");
    }

    public function render_board(): string
    {
        ob_start();
        echo '<div class="algq-kanban">';
        foreach (self::STAGES as $stage) {
            echo '<section class="algq-kanban-stage" data-stage="' . esc_attr($stage) . '"><h3>' . esc_html($stage) . '</h3><p>Drag-and-drop deal cards will appear here.</p></section>';
        }
        echo '</div>';
        return (string) ob_get_clean();
    }

    public function move_stage(): void
    {
        check_ajax_referer('algq_pipeline_move', 'nonce');
        $deal_id = sanitize_text_field(wp_unslash($_POST['deal_id'] ?? ''));
        $stage = sanitize_text_field(wp_unslash($_POST['stage'] ?? ''));
        if (!in_array($stage, self::STAGES, true)) {
            wp_send_json_error(['message' => 'Invalid stage'], 400);
        }
        $this->log_activity($deal_id, 'stage_moved', 'Moved to ' . $stage);
        wp_send_json_success(['stage' => $stage]);
    }

    private function log_activity(string $deal_id, string $type, string $note): void
    {
        global $wpdb;
        $wpdb->insert($wpdb->prefix . self::ACTIVITY_TABLE, ['deal_id' => $deal_id, 'activity_type' => $type, 'activity_note' => $note, 'created_at' => current_time('mysql')], ['%s', '%s', '%s', '%s']);
    }
}

register_activation_hook(__FILE__, ['ALGQ_Pipeline_CRM', 'activate']);
new ALGQ_Pipeline_CRM();
