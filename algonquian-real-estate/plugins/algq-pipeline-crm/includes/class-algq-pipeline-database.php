<?php
/**
 * Database access layer for Algonquian Pipeline CRM.
 *
 * @package Algonquian_Pipeline_CRM
 */

if (!defined('ABSPATH')) {
    exit;
}

class ALGQ_Pipeline_Database
{
    public const DEALS_TABLE = 'algq_pipeline_deals';
    public const STAGES_TABLE = 'algq_pipeline_stages';
    public const ACTIVITY_TABLE = 'algq_pipeline_activity';
    public const NOTES_TABLE = 'algq_pipeline_notes';
    public const ASSIGNMENTS_TABLE = 'algq_pipeline_assignments';

    public const DEFAULT_STAGES = [
        'lead_captured' => 'Lead Captured',
        'underwriting' => 'Underwriting',
        'offer_sent' => 'Offer Sent',
        'under_contract' => 'Under Contract',
        'buyer_assigned' => 'Buyer Assigned',
        'closed' => 'Closed',
    ];

    public function get_table_name(string $table): string
    {
        global $wpdb;
        return $wpdb->prefix . $table;
    }

    public function create_tables(): void
    {
        global $wpdb;

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset_collate = $wpdb->get_charset_collate();
        $deals = $this->get_table_name(self::DEALS_TABLE);
        $stages = $this->get_table_name(self::STAGES_TABLE);
        $activity = $this->get_table_name(self::ACTIVITY_TABLE);
        $notes = $this->get_table_name(self::NOTES_TABLE);
        $assignments = $this->get_table_name(self::ASSIGNMENTS_TABLE);

        dbDelta("CREATE TABLE {$stages} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            stage_key varchar(64) NOT NULL,
            stage_label varchar(191) NOT NULL,
            stage_order int(11) NOT NULL DEFAULT 0,
            is_closed tinyint(1) NOT NULL DEFAULT 0,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY stage_key (stage_key),
            KEY stage_order (stage_order)
        ) {$charset_collate};");

        dbDelta("CREATE TABLE {$deals} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            external_id varchar(64) DEFAULT '',
            stage_key varchar(64) NOT NULL DEFAULT 'lead_captured',
            property_address text NOT NULL,
            seller_name varchar(191) NOT NULL DEFAULT '',
            seller_email varchar(191) DEFAULT '',
            seller_phone varchar(64) DEFAULT '',
            priority varchar(32) NOT NULL DEFAULT 'normal',
            assigned_user_id bigint(20) unsigned DEFAULT 0,
            asking_price decimal(14,2) DEFAULT NULL,
            estimated_arv decimal(14,2) DEFAULT NULL,
            status varchar(32) NOT NULL DEFAULT 'open',
            source varchar(64) DEFAULT '',
            created_by bigint(20) unsigned DEFAULT 0,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            stage_changed_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY stage_key (stage_key),
            KEY assigned_user_id (assigned_user_id),
            KEY status (status),
            KEY external_id (external_id)
        ) {$charset_collate};");

        dbDelta("CREATE TABLE {$activity} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            deal_id bigint(20) unsigned NOT NULL DEFAULT 0,
            activity_type varchar(64) NOT NULL,
            activity_note text NOT NULL,
            actor_user_id bigint(20) unsigned DEFAULT 0,
            old_value varchar(191) DEFAULT '',
            new_value varchar(191) DEFAULT '',
            metadata longtext DEFAULT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY deal_id (deal_id),
            KEY activity_type (activity_type),
            KEY created_at (created_at)
        ) {$charset_collate};");

        dbDelta("CREATE TABLE {$notes} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            deal_id bigint(20) unsigned NOT NULL,
            note text NOT NULL,
            created_by bigint(20) unsigned DEFAULT 0,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY deal_id (deal_id),
            KEY created_by (created_by)
        ) {$charset_collate};");

        dbDelta("CREATE TABLE {$assignments} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            deal_id bigint(20) unsigned NOT NULL,
            assigned_user_id bigint(20) unsigned NOT NULL,
            assigned_by bigint(20) unsigned DEFAULT 0,
            assigned_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY deal_id (deal_id),
            KEY assigned_user_id (assigned_user_id)
        ) {$charset_collate};");
    }

    public function seed_default_stages(): void
    {
        global $wpdb;

        $order = 10;
        $now = current_time('mysql');
        $table = $this->get_table_name(self::STAGES_TABLE);

        foreach (self::DEFAULT_STAGES as $key => $label) {
            $existing_id = (int) $wpdb->get_var($wpdb->prepare("SELECT id FROM {$table} WHERE stage_key = %s", $key));
            $data = [
                'stage_key' => $key,
                'stage_label' => $label,
                'stage_order' => $order,
                'is_closed' => 'closed' === $key ? 1 : 0,
                'updated_at' => $now,
            ];

            if ($existing_id > 0) {
                $wpdb->update($table, $data, ['id' => $existing_id], ['%s', '%s', '%d', '%d', '%s'], ['%d']);
            } else {
                $data['created_at'] = $now;
                $wpdb->insert($table, $data, ['%s', '%s', '%d', '%d', '%s', '%s']);
            }

            $order += 10;
        }
    }

    public function get_stages(): array
    {
        global $wpdb;
        $table = $this->get_table_name(self::STAGES_TABLE);
        $stages = $wpdb->get_results("SELECT * FROM {$table} ORDER BY stage_order ASC, id ASC", ARRAY_A);

        if (!is_array($stages) || [] === $stages) {
            return $this->fallback_stages();
        }

        return $stages;
    }

    public function get_stage_keys(): array
    {
        return wp_list_pluck($this->get_stages(), 'stage_key');
    }

    public function get_deals(array $args = []): array
    {
        global $wpdb;
        $table = $this->get_table_name(self::DEALS_TABLE);
        $where = 'WHERE 1=1';
        $values = [];

        if (!empty($args['stage_key'])) {
            $where .= ' AND stage_key = %s';
            $values[] = sanitize_key((string) $args['stage_key']);
        }

        if (!empty($args['status'])) {
            $where .= ' AND status = %s';
            $values[] = sanitize_key((string) $args['status']);
        }

        $limit = isset($args['limit']) ? max(1, min(500, absint($args['limit']))) : 200;
        $sql = "SELECT * FROM {$table} {$where} ORDER BY updated_at DESC LIMIT %d";
        $values[] = $limit;

        return $wpdb->get_results($wpdb->prepare($sql, $values), ARRAY_A) ?: [];
    }

    public function get_deal(int $deal_id): ?array
    {
        global $wpdb;
        $table = $this->get_table_name(self::DEALS_TABLE);
        $deal = $wpdb->get_row($wpdb->prepare("SELECT * FROM {$table} WHERE id = %d", $deal_id), ARRAY_A);
        return is_array($deal) ? $deal : null;
    }

    public function create_deal(array $data): int
    {
        global $wpdb;
        $table = $this->get_table_name(self::DEALS_TABLE);
        $now = current_time('mysql');
        $stage_key = !empty($data['stage_key']) ? sanitize_key((string) $data['stage_key']) : 'lead_captured';

        if (!in_array($stage_key, $this->get_stage_keys(), true)) {
            $stage_key = 'lead_captured';
        }

        $inserted = $wpdb->insert(
            $table,
            [
                'external_id' => isset($data['external_id']) ? sanitize_text_field((string) $data['external_id']) : '',
                'stage_key' => $stage_key,
                'property_address' => isset($data['property_address']) ? sanitize_textarea_field((string) $data['property_address']) : '',
                'seller_name' => isset($data['seller_name']) ? sanitize_text_field((string) $data['seller_name']) : '',
                'seller_email' => isset($data['seller_email']) ? sanitize_email((string) $data['seller_email']) : '',
                'seller_phone' => isset($data['seller_phone']) ? sanitize_text_field((string) $data['seller_phone']) : '',
                'priority' => isset($data['priority']) ? sanitize_key((string) $data['priority']) : 'normal',
                'assigned_user_id' => isset($data['assigned_user_id']) ? absint($data['assigned_user_id']) : 0,
                'asking_price' => $this->nullable_decimal($data['asking_price'] ?? null),
                'estimated_arv' => $this->nullable_decimal($data['estimated_arv'] ?? null),
                'status' => isset($data['status']) ? sanitize_key((string) $data['status']) : 'open',
                'source' => isset($data['source']) ? sanitize_key((string) $data['source']) : '',
                'created_by' => get_current_user_id(),
                'created_at' => $now,
                'updated_at' => $now,
                'stage_changed_at' => $now,
            ],
            ['%s', '%s', '%s', '%s', '%s', '%s', '%s', '%d', '%f', '%f', '%s', '%s', '%d', '%s', '%s', '%s']
        );

        return false === $inserted ? 0 : (int) $wpdb->insert_id;
    }

    public function update_deal(int $deal_id, array $data): bool
    {
        global $wpdb;
        $allowed = ['property_address', 'seller_name', 'seller_email', 'seller_phone', 'priority', 'assigned_user_id', 'asking_price', 'estimated_arv', 'status', 'source'];
        $update = [];
        $formats = [];

        foreach ($allowed as $field) {
            if (!array_key_exists($field, $data)) {
                continue;
            }

            if ('assigned_user_id' === $field) {
                $update[$field] = absint($data[$field]);
                $formats[] = '%d';
            } elseif (in_array($field, ['asking_price', 'estimated_arv'], true)) {
                $update[$field] = $this->nullable_decimal($data[$field]);
                $formats[] = '%f';
            } elseif ('property_address' === $field) {
                $update[$field] = sanitize_textarea_field((string) $data[$field]);
                $formats[] = '%s';
            } elseif ('seller_email' === $field) {
                $update[$field] = sanitize_email((string) $data[$field]);
                $formats[] = '%s';
            } elseif (in_array($field, ['priority', 'status', 'source'], true)) {
                $update[$field] = sanitize_key((string) $data[$field]);
                $formats[] = '%s';
            } else {
                $update[$field] = sanitize_text_field((string) $data[$field]);
                $formats[] = '%s';
            }
        }

        if ([] === $update) {
            return true;
        }

        $update['updated_at'] = current_time('mysql');
        $formats[] = '%s';

        return false !== $wpdb->update($this->get_table_name(self::DEALS_TABLE), $update, ['id' => $deal_id], $formats, ['%d']);
    }

    public function update_deal_stage(int $deal_id, string $stage_key): bool
    {
        global $wpdb;
        if (!in_array($stage_key, $this->get_stage_keys(), true)) {
            return false;
        }

        $status = 'closed' === $stage_key ? 'closed' : 'open';
        return false !== $wpdb->update(
            $this->get_table_name(self::DEALS_TABLE),
            ['stage_key' => $stage_key, 'status' => $status, 'updated_at' => current_time('mysql'), 'stage_changed_at' => current_time('mysql')],
            ['id' => $deal_id],
            ['%s', '%s', '%s', '%s'],
            ['%d']
        );
    }

    public function get_activity(array $args = []): array
    {
        global $wpdb;
        $table = $this->get_table_name(self::ACTIVITY_TABLE);
        $where = 'WHERE 1=1';
        $values = [];

        if (!empty($args['deal_id'])) {
            $where .= ' AND deal_id = %d';
            $values[] = absint($args['deal_id']);
        }

        $limit = isset($args['limit']) ? max(1, min(500, absint($args['limit']))) : 100;
        $values[] = $limit;
        return $wpdb->get_results($wpdb->prepare("SELECT * FROM {$table} {$where} ORDER BY created_at DESC, id DESC LIMIT %d", $values), ARRAY_A) ?: [];
    }

    public function get_metrics(): array
    {
        global $wpdb;
        $deals = $this->get_table_name(self::DEALS_TABLE);
        $stages = $this->get_stages();
        $metrics = [
            'total_deals' => (int) $wpdb->get_var("SELECT COUNT(*) FROM {$deals}"),
            'open_deals' => (int) $wpdb->get_var("SELECT COUNT(*) FROM {$deals} WHERE status = 'open'"),
            'closed_deals' => (int) $wpdb->get_var("SELECT COUNT(*) FROM {$deals} WHERE status = 'closed'"),
            'stage_counts' => [],
        ];

        foreach ($stages as $stage) {
            $key = (string) $stage['stage_key'];
            $metrics['stage_counts'][$key] = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$deals} WHERE stage_key = %s", $key));
        }

        return $metrics;
    }

    private function fallback_stages(): array
    {
        $stages = [];
        $order = 10;
        foreach (self::DEFAULT_STAGES as $key => $label) {
            $stages[] = [
                'id' => 0,
                'stage_key' => $key,
                'stage_label' => $label,
                'stage_order' => $order,
                'is_closed' => 'closed' === $key ? 1 : 0,
            ];
            $order += 10;
        }
        return $stages;
    }

    private function nullable_decimal($value)
    {
        if (null === $value || '' === $value) {
            return null;
        }
        return (float) preg_replace('/[^0-9.\-]/', '', (string) $value);
    }
}
