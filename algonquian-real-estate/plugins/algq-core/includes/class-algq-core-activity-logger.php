<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Core_Activity_Logger
{
    private const TABLE = 'algq_activity_log';

    public function log(string $activity_type, string $activity_note, array $args = []): bool
    {
        global $wpdb;
        $table = $wpdb->prefix . self::TABLE;
        return false !== $wpdb->insert($table, [
            'object_type' => sanitize_key($args['object_type'] ?? ''),
            'object_id' => sanitize_text_field((string) ($args['object_id'] ?? '')),
            'deal_id' => sanitize_text_field((string) ($args['deal_id'] ?? '')),
            'user_id' => (int) ($args['user_id'] ?? get_current_user_id()),
            'activity_type' => sanitize_key($activity_type),
            'activity_note' => wp_kses_post($activity_note),
            'context' => wp_json_encode($args['context'] ?? []),
            'created_at' => current_time('mysql'),
        ], ['%s', '%s', '%s', '%d', '%s', '%s', '%s', '%s']);
    }
}
