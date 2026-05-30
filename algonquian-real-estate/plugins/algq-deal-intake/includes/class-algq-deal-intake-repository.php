<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Intake_Repository
{
    public const TABLE = 'algq_deals';

    public static function table_name(): string
    {
        global $wpdb;
        return $wpdb->prefix . self::TABLE;
    }

    /**
     * @return int|false
     */
    public function create(array $data)
    {
        global $wpdb;

        $now = current_time('mysql');
        $deal_id = $data['deal_id'] ?? $this->generate_deal_id();
        $inserted = $wpdb->insert(
            self::table_name(),
            [
                'deal_id' => $deal_id,
                'seller_name' => $data['seller_name'],
                'seller_phone' => $data['seller_phone'],
                'seller_email' => $data['seller_email'] ?? '',
                'address' => $data['address'],
                'asking_price' => $data['asking_price'] ?? 0,
                'condition_notes' => $data['condition_notes'] ?? '',
                'lead_source' => $data['lead_source'] ?? 'website',
                'motivation_score' => $data['motivation_score'] ?? 0,
                'motivation_signals' => wp_json_encode($data['motivation_signals'] ?? []),
                'property_tags' => wp_json_encode($data['property_tags'] ?? []),
                'status' => $data['status'] ?? 'new',
                'created_at' => $data['created_at'] ?? $now,
                'updated_at' => $now,
            ],
            ['%s', '%s', '%s', '%s', '%s', '%f', '%s', '%s', '%d', '%s', '%s', '%s', '%s', '%s']
        );

        return false === $inserted ? false : (int) $wpdb->insert_id;
    }

    public function find(int $id): ?array
    {
        global $wpdb;
        $row = $wpdb->get_row($wpdb->prepare('SELECT * FROM ' . self::table_name() . ' WHERE id = %d', $id), ARRAY_A);
        return $row ? $this->hydrate($row) : null;
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

        if (!empty($filters['status'])) {
            $where .= ' AND status = %s';
            $args[] = sanitize_key($filters['status']);
        }
        if (!empty($filters['lead_source'])) {
            $where .= ' AND lead_source = %s';
            $args[] = sanitize_key($filters['lead_source']);
        }

        $sql = 'SELECT * FROM ' . self::table_name() . " {$where} ORDER BY created_at DESC LIMIT %d";
        $args[] = $limit;
        $prepared = $wpdb->prepare($sql, $args);
        $rows = $wpdb->get_results($prepared, ARRAY_A);

        return array_map([$this, 'hydrate'], $rows ?: []);
    }

    private function generate_deal_id(): string
    {
        return 'ALGQ-' . gmdate('Ymd') . '-' . strtoupper(wp_generate_password(6, false, false));
    }

    private function hydrate(array $row): array
    {
        $row['motivation_score'] = (int) ($row['motivation_score'] ?? 0);
        $row['asking_price'] = (float) ($row['asking_price'] ?? 0);
        $row['motivation_signals'] = json_decode((string) ($row['motivation_signals'] ?? '[]'), true) ?: [];
        $row['property_tags'] = json_decode((string) ($row['property_tags'] ?? '[]'), true) ?: [];
        return $row;
    }
}
