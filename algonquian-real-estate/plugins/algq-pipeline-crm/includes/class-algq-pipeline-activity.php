<?php
/**
 * Activity logging for Pipeline CRM.
 *
 * @package Algonquian_Pipeline_CRM
 */

if (!defined('ABSPATH')) {
    exit;
}

class ALGQ_Pipeline_Activity
{
    private ALGQ_Pipeline_Database $database;

    public function __construct(ALGQ_Pipeline_Database $database)
    {
        $this->database = $database;
    }

    public function log(int $deal_id, string $type, string $note, string $old_value = '', string $new_value = '', array $metadata = []): int
    {
        global $wpdb;

        $type = sanitize_key($type);
        $note = sanitize_textarea_field($note);
        $old_value = sanitize_text_field($old_value);
        $new_value = sanitize_text_field($new_value);
        $metadata_json = [] === $metadata ? null : wp_json_encode($metadata);

        $inserted = $wpdb->insert(
            $this->database->get_table_name(ALGQ_Pipeline_Database::ACTIVITY_TABLE),
            [
                'deal_id' => absint($deal_id),
                'activity_type' => $type,
                'activity_note' => $note,
                'actor_user_id' => get_current_user_id(),
                'old_value' => $old_value,
                'new_value' => $new_value,
                'metadata' => $metadata_json,
                'created_at' => current_time('mysql'),
            ],
            ['%d', '%s', '%s', '%d', '%s', '%s', '%s', '%s']
        );

        return false === $inserted ? 0 : (int) $wpdb->insert_id;
    }

    public function note_added(int $deal_id, string $note): int
    {
        return $this->log($deal_id, 'note_added', $note);
    }

    public function assigned_user_changed(int $deal_id, int $old_user_id, int $new_user_id): int
    {
        return $this->log($deal_id, 'assigned_user_changed', __('Assigned user changed.', 'algq-pipeline-crm'), (string) $old_user_id, (string) $new_user_id);
    }
}
