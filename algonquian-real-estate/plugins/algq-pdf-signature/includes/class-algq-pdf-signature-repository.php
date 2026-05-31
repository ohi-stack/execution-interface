<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_PDF_Signature_Repository
{
    public const DOCUMENTS_TABLE = 'algq_documents';
    public const EVENTS_TABLE = 'algq_document_events';

    public static function documents_table(): string
    {
        global $wpdb;
        return $wpdb->prefix . self::DOCUMENTS_TABLE;
    }

    public static function events_table(): string
    {
        global $wpdb;
        return $wpdb->prefix . self::EVENTS_TABLE;
    }

    /**
     * @return int|false
     */
    public function create_document(array $data, string $rendered_html = '', string $pdf_checksum = '')
    {
        global $wpdb;

        $now = current_time('mysql');
        $document_uid = $data['document_uid'] ?? $this->generate_document_uid();
        $expires_at = !empty($data['expires_at']) ? $data['expires_at'] : gmdate('Y-m-d H:i:s', strtotime('+14 days'));
        $status = sanitize_key($data['status'] ?? 'draft');
        $execution_status = $this->execution_status_for($status);

        $inserted = $wpdb->insert(
            self::documents_table(),
            [
                'document_uid' => $document_uid,
                'title' => sanitize_text_field($data['title'] ?? 'Untitled Document'),
                'document_type' => sanitize_key($data['document_type'] ?? 'purchase_agreement'),
                'related_deal_id' => sanitize_text_field($data['related_deal_id'] ?? ''),
                'recipient_name' => sanitize_text_field($data['recipient_name'] ?? ''),
                'recipient_email' => sanitize_email($data['recipient_email'] ?? ''),
                'status' => $status,
                'execution_status' => $execution_status,
                'source_payload' => wp_json_encode($data['payload'] ?? []),
                'rendered_html' => wp_kses_post($rendered_html),
                'pdf_checksum' => sanitize_text_field($pdf_checksum),
                'expires_at' => $expires_at,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            ['%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s']
        );

        if (false === $inserted) {
            return false;
        }

        $id = (int) $wpdb->insert_id;
        $this->record_event($id, 'document.created', get_current_user_id() ? wp_get_current_user()->user_login : 'system', 'Document created and rendered.');
        return $id;
    }

    public function find(int $id): ?array
    {
        global $wpdb;
        $row = $wpdb->get_row($wpdb->prepare('SELECT * FROM ' . self::documents_table() . ' WHERE id = %d', $id), ARRAY_A);
        return $row ? $this->hydrate_document($row) : null;
    }

    public function find_by_uid(string $uid): ?array
    {
        global $wpdb;
        $row = $wpdb->get_row($wpdb->prepare('SELECT * FROM ' . self::documents_table() . ' WHERE document_uid = %s', sanitize_text_field($uid)), ARRAY_A);
        return $row ? $this->hydrate_document($row) : null;
    }

    /**
     * @return array<int,array<string,mixed>>
     */
    public function all(int $limit = 50, array $filters = []): array
    {
        global $wpdb;
        $limit = $limit > 0 ? max(1, min(200, $limit)) : 50;
        $where = 'WHERE 1=1';
        $args = [];

        foreach (['status', 'execution_status', 'document_type', 'related_deal_id'] as $field) {
            if (!empty($filters[$field])) {
                $where .= " AND {$field} = %s";
                $args[] = 'related_deal_id' === $field ? sanitize_text_field($filters[$field]) : sanitize_key($filters[$field]);
            }
        }

        $sql = 'SELECT * FROM ' . self::documents_table() . " {$where} ORDER BY created_at DESC LIMIT %d";
        $args[] = $limit;
        $rows = $wpdb->get_results($wpdb->prepare($sql, $args), ARRAY_A);

        return array_map([$this, 'hydrate_document'], $rows ?: []);
    }

    public function mark_sent(int $id, string $actor = ''): bool
    {
        $updated = $this->update_status($id, 'sent', ['sent_at' => current_time('mysql')]);
        if ($updated) {
            $this->record_event($id, 'signature.sent', $actor, 'Signature request sent to recipient.');
        }
        return $updated;
    }

    public function sign_document(int $id, string $signer_name, string $signature_payload, string $actor_ip = ''): bool
    {
        global $wpdb;

        $hash = hash('sha256', $id . '|' . $signer_name . '|' . $signature_payload . '|' . wp_salt('auth'));
        $updated = false !== $wpdb->update(
            self::documents_table(),
            [
                'signer_name' => sanitize_text_field($signer_name),
                'signature_hash' => $hash,
                'status' => 'signed',
                'execution_status' => $this->execution_status_for('signed'),
                'signed_at' => current_time('mysql'),
                'archived_at' => current_time('mysql'),
                'updated_at' => current_time('mysql'),
            ],
            ['id' => $id],
            ['%s', '%s', '%s', '%s', '%s', '%s', '%s'],
            ['%d']
        );

        if ($updated) {
            $this->record_event($id, 'signature.completed', $signer_name, 'Document signed and archived.', ['signature_hash' => $hash], $actor_ip);
        }

        return $updated;
    }

    public function archive(int $id, string $actor = ''): bool
    {
        $updated = $this->update_status($id, 'archived', ['archived_at' => current_time('mysql')]);
        if ($updated) {
            $this->record_event($id, 'document.archived', $actor, 'Document moved into archive.');
        }
        return $updated;
    }

    public function void(int $id, string $actor = '', string $reason = ''): bool
    {
        $updated = $this->update_status($id, 'voided');
        if ($updated) {
            $this->record_event($id, 'document.voided', $actor, $reason ?: 'Document voided.');
        }
        return $updated;
    }

    /**
     * @return array<int,array<string,mixed>>
     */
    public function events(int $document_id): array
    {
        global $wpdb;
        $rows = $wpdb->get_results($wpdb->prepare('SELECT * FROM ' . self::events_table() . ' WHERE document_id = %d ORDER BY created_at ASC, id ASC', $document_id), ARRAY_A);
        return array_map(static function (array $row): array {
            $row['id'] = (int) $row['id'];
            $row['document_id'] = (int) $row['document_id'];
            $row['metadata'] = json_decode((string) ($row['metadata'] ?? '{}'), true) ?: [];
            return $row;
        }, $rows ?: []);
    }

    public function record_event(int $document_id, string $event_type, string $actor = '', string $message = '', array $metadata = [], string $actor_ip = ''): void
    {
        global $wpdb;
        $wpdb->insert(
            self::events_table(),
            [
                'document_id' => $document_id,
                'event_type' => sanitize_key(str_replace('.', '_', $event_type)),
                'actor' => sanitize_text_field($actor),
                'actor_ip' => sanitize_text_field($actor_ip),
                'message' => sanitize_textarea_field($message),
                'metadata' => wp_json_encode($metadata),
                'created_at' => current_time('mysql'),
            ],
            ['%d', '%s', '%s', '%s', '%s', '%s', '%s']
        );
    }

    private function update_status(int $id, string $status, array $extra = []): bool
    {
        global $wpdb;
        $status = sanitize_key($status);
        $data = array_merge($extra, [
            'status' => $status,
            'execution_status' => $this->execution_status_for($status),
            'updated_at' => current_time('mysql'),
        ]);
        $formats = array_fill(0, count($data), '%s');
        return false !== $wpdb->update(self::documents_table(), $data, ['id' => $id], $formats, ['%d']);
    }

    private function execution_status_for(string $status): string
    {
        $map = [
            'draft' => 'not_started',
            'sent' => 'awaiting_signature',
            'viewed' => 'awaiting_signature',
            'signed' => 'fully_executed',
            'archived' => 'fully_executed',
            'voided' => 'cancelled',
            'expired' => 'expired',
        ];
        return $map[$status] ?? 'in_progress';
    }

    private function generate_document_uid(): string
    {
        return 'DOC-' . gmdate('Ymd') . '-' . strtoupper(wp_generate_password(8, false, false));
    }

    private function hydrate_document(array $row): array
    {
        $row['id'] = (int) ($row['id'] ?? 0);
        $row['source_payload'] = json_decode((string) ($row['source_payload'] ?? '{}'), true) ?: [];
        return $row;
    }
}
