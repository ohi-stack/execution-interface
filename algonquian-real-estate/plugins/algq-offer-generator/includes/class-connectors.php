<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Offer_Connectors
{
    public function deal_payload(string $deal_id): array
    {
        global $wpdb;

        $deal_id = sanitize_text_field($deal_id);
        if ('' === $deal_id || !$this->table_exists('algq_deals')) {
            return [];
        }

        $table = $wpdb->prefix . 'algq_deals';
        $row = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$table} WHERE deal_uid = %s OR id = %d", $deal_id, (int) $deal_id), ARRAY_A);
        if (!$row) {
            return [];
        }

        return [
            'seller_name' => $row['seller_name'] ?? '',
            'seller_email' => $row['seller_email'] ?? '',
            'property_address' => $row['property_address'] ?? '',
            'purchase_price' => isset($row['asking_price']) ? '$' . number_format((float) $row['asking_price'], 2) : '',
            'deal_id' => $row['deal_uid'] ?? (string) ($row['id'] ?? ''),
        ];
    }

    public function table_exists(string $table): bool
    {
        global $wpdb;
        $full = $wpdb->prefix . sanitize_key($table);
        return (string) $wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $full)) === $full;
    }
}
