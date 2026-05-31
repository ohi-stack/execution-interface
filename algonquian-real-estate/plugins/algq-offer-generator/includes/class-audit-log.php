<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Offer_Audit_Log
{
    public function record(string $object_type, string $object_id, string $event_type, string $message = '', array $metadata = []): void
    {
        global $wpdb;

        $user = wp_get_current_user();
        $actor = $user && $user->exists() ? $user->user_login : 'system';

        $wpdb->insert(
            ALGQ_Offer_Database::audit_table(),
            [
                'object_type' => sanitize_key($object_type),
                'object_id' => sanitize_text_field($object_id),
                'event_type' => sanitize_key($event_type),
                'actor' => sanitize_text_field($actor),
                'message' => sanitize_textarea_field($message),
                'metadata' => wp_json_encode($metadata),
                'created_at' => current_time('mysql'),
            ],
            ['%s', '%s', '%s', '%s', '%s', '%s', '%s']
        );
    }

    /**
     * @return array<int,array<string,mixed>>
     */
    public function for_object(string $object_type, string $object_id, int $limit = 25): array
    {
        global $wpdb;
        $limit = max(1, min(100, $limit));
        $rows = $wpdb->get_results(
            $wpdb->prepare(
                'SELECT * FROM ' . ALGQ_Offer_Database::audit_table() . ' WHERE object_type = %s AND object_id = %s ORDER BY created_at DESC LIMIT %d',
                sanitize_key($object_type),
                sanitize_text_field($object_id),
                $limit
            ),
            ARRAY_A
        );

        return array_map(static function (array $row): array {
            $row['metadata'] = json_decode((string) ($row['metadata'] ?? '{}'), true) ?: [];
            return $row;
        }, $rows ?: []);
    }
}
