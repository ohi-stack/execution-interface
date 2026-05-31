<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Core_Notifications
{
    private const TABLE = 'algq_notifications';

    public function create(int $user_id, string $title, string $message, array $args = []): bool
    {
        global $wpdb;
        $table = $wpdb->prefix . self::TABLE;
        return false !== $wpdb->insert($table, [
            'user_id' => $user_id,
            'channel' => sanitize_key($args['channel'] ?? 'dashboard'),
            'title' => sanitize_text_field($title),
            'message' => wp_kses_post($message),
            'status' => sanitize_key($args['status'] ?? 'unread'),
            'context' => wp_json_encode($args['context'] ?? []),
            'created_at' => current_time('mysql'),
            'read_at' => null,
        ], ['%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s']);
    }

    public function unread_count(int $user_id): int
    {
        global $wpdb;
        $table = $wpdb->prefix . self::TABLE;
        return (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$table} WHERE user_id = %d AND status = %s", $user_id, 'unread'));
    }
}
