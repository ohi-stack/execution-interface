<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Offer_Database
{
    public const DOCUMENTS_TABLE = 'algq_offer_documents';
    public const AUDIT_TABLE = 'algq_offer_audit_log';

    public static function documents_table(): string
    {
        global $wpdb;
        return $wpdb->prefix . self::DOCUMENTS_TABLE;
    }

    public static function audit_table(): string
    {
        global $wpdb;
        return $wpdb->prefix . self::AUDIT_TABLE;
    }

    public static function activate(): void
    {
        global $wpdb;

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        $charset = $wpdb->get_charset_collate();
        $documents = self::documents_table();
        $audit = self::audit_table();

        dbDelta("CREATE TABLE {$documents} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            document_uid varchar(48) NOT NULL,
            deal_id varchar(64) DEFAULT '',
            document_type varchar(80) NOT NULL DEFAULT 'loi',
            title varchar(191) NOT NULL,
            status varchar(40) NOT NULL DEFAULT 'draft',
            merge_payload longtext NULL,
            rendered_html longtext NULL,
            pdf_checksum varchar(128) DEFAULT '',
            signature_uid varchar(80) DEFAULT '',
            created_by bigint(20) unsigned DEFAULT 0,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY document_uid (document_uid),
            KEY deal_id (deal_id),
            KEY document_type (document_type),
            KEY status (status)
        ) {$charset};");

        dbDelta("CREATE TABLE {$audit} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            object_type varchar(80) NOT NULL,
            object_id varchar(80) NOT NULL,
            event_type varchar(100) NOT NULL,
            actor varchar(191) DEFAULT '',
            message text NULL,
            metadata longtext NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY object_lookup (object_type, object_id),
            KEY event_type (event_type),
            KEY created_at (created_at)
        ) {$charset};");
    }

    public function save_document(array $record): int
    {
        global $wpdb;

        $now = current_time('mysql');
        $uid = sanitize_text_field($record['document_uid'] ?? $this->generate_uid());
        $payload = wp_json_encode($record['merge_payload'] ?? []);
        $data = [
            'document_uid' => $uid,
            'deal_id' => sanitize_text_field($record['deal_id'] ?? ''),
            'document_type' => sanitize_key($record['document_type'] ?? 'loi'),
            'title' => sanitize_text_field($record['title'] ?? 'Untitled Offer Document'),
            'status' => sanitize_key($record['status'] ?? 'draft'),
            'merge_payload' => $payload,
            'rendered_html' => wp_kses_post($record['rendered_html'] ?? ''),
            'pdf_checksum' => sanitize_text_field($record['pdf_checksum'] ?? ''),
            'signature_uid' => sanitize_text_field($record['signature_uid'] ?? ''),
            'created_by' => (int) ($record['created_by'] ?? get_current_user_id()),
            'updated_at' => $now,
        ];

        if (!empty($record['id'])) {
            $wpdb->update(self::documents_table(), $data, ['id' => (int) $record['id']]);
            return (int) $record['id'];
        }

        $data['created_at'] = $now;
        $wpdb->insert(self::documents_table(), $data);
        return (int) $wpdb->insert_id;
    }

    public function find_document(int $id): ?array
    {
        global $wpdb;
        $row = $wpdb->get_row($wpdb->prepare('SELECT * FROM ' . self::documents_table() . ' WHERE id = %d', $id), ARRAY_A);
        return $row ? $this->hydrate($row) : null;
    }

    /**
     * @return array<int,array<string,mixed>>
     */
    public function recent_documents(int $limit = 20): array
    {
        global $wpdb;
        $limit = max(1, min(100, $limit));
        $rows = $wpdb->get_results($wpdb->prepare('SELECT * FROM ' . self::documents_table() . ' ORDER BY updated_at DESC LIMIT %d', $limit), ARRAY_A);
        return array_map([$this, 'hydrate'], $rows ?: []);
    }

    private function generate_uid(): string
    {
        return 'OFFER-' . gmdate('Ymd') . '-' . strtoupper(wp_generate_password(8, false, false));
    }

    private function hydrate(array $row): array
    {
        $row['id'] = (int) ($row['id'] ?? 0);
        $row['merge_payload'] = json_decode((string) ($row['merge_payload'] ?? '{}'), true) ?: [];
        return $row;
    }
}
