<?php
/**
 * Database repository for Deal Marketplace.
 *
 * @package Algonquian_Deal_Marketplace
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Marketplace_Repository
{
    public function listings_table(): string
    {
        global $wpdb;
        return $wpdb->prefix . 'algq_deal_marketplace_listings';
    }

    public function interests_table(): string
    {
        global $wpdb;
        return $wpdb->prefix . 'algq_deal_marketplace_interests';
    }

    public function nda_table(): string
    {
        global $wpdb;
        return $wpdb->prefix . 'algq_deal_marketplace_ndas';
    }

    public function audit_table(): string
    {
        global $wpdb;
        return $wpdb->prefix . 'algq_deal_marketplace_audit_log';
    }

    public function create_tables(): void
    {
        global $wpdb;

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        $charset_collate = $wpdb->get_charset_collate();

        dbDelta("CREATE TABLE {$this->listings_table()} (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            deal_id BIGINT UNSIGNED NULL,
            title VARCHAR(255) NOT NULL,
            status VARCHAR(40) NOT NULL DEFAULT 'draft',
            visibility VARCHAR(40) NOT NULL DEFAULT 'private',
            price DECIMAL(14,2) NULL,
            meta LONGTEXT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            PRIMARY KEY  (id),
            KEY status (status),
            KEY visibility (visibility)
        ) {$charset_collate};");

        dbDelta("CREATE TABLE {$this->interests_table()} (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            listing_id BIGINT UNSIGNED NOT NULL,
            user_id BIGINT UNSIGNED NULL,
            buyer_name VARCHAR(190) NOT NULL,
            buyer_email VARCHAR(190) NOT NULL,
            offer_amount DECIMAL(14,2) NULL,
            message TEXT NULL,
            status VARCHAR(40) NOT NULL DEFAULT 'new',
            created_at DATETIME NOT NULL,
            PRIMARY KEY  (id),
            KEY listing_id (listing_id),
            KEY buyer_email (buyer_email)
        ) {$charset_collate};");

        dbDelta("CREATE TABLE {$this->nda_table()} (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            listing_id BIGINT UNSIGNED NOT NULL,
            user_id BIGINT UNSIGNED NOT NULL,
            accepted_at DATETIME NOT NULL,
            ip_hash VARCHAR(128) NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY listing_user (listing_id, user_id)
        ) {$charset_collate};");

        dbDelta("CREATE TABLE {$this->audit_table()} (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            user_id BIGINT UNSIGNED NULL,
            action VARCHAR(100) NOT NULL,
            object_type VARCHAR(100) NULL,
            object_id BIGINT UNSIGNED NULL,
            context LONGTEXT NULL,
            created_at DATETIME NOT NULL,
            PRIMARY KEY  (id),
            KEY action (action),
            KEY object_lookup (object_type, object_id)
        ) {$charset_collate};");
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function get_active_listings(): array
    {
        global $wpdb;

        $rows = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$this->listings_table()} WHERE status = %s ORDER BY updated_at DESC LIMIT 50",
                'active'
            ),
            ARRAY_A
        );

        if (!is_array($rows) || [] === $rows) {
            return $this->default_modules();
        }

        return $rows;
    }

    /**
     * @return array<int, array<string, string>>
     */
    public function default_modules(): array
    {
        return [
            [
                'title' => 'Wholesale deals',
                'description' => 'Curated off-market assignment opportunities with deal highlights, pricing guidance, and diligence checkpoints.',
                'status' => 'Deal room ready',
            ],
            [
                'title' => 'Investor access',
                'description' => 'Permissioned access tiers for vetted investors, capital partners, and acquisition collaborators.',
                'status' => 'Access gated',
            ],
            [
                'title' => 'Deal syndication',
                'description' => 'Distribution workflows for sending qualified listings to buyer lists, investor circles, and private partner channels.',
                'status' => 'Distribution mapped',
            ],
            [
                'title' => 'Buyer subscriptions',
                'description' => 'Recurring buyer membership tiers for priority deal alerts, downloads, market preferences, and saved buy boxes.',
                'status' => 'Subscription-ready',
            ],
            [
                'title' => 'Premium listings',
                'description' => 'Featured placement for high-value opportunities with enhanced media, underwriting summaries, and urgency indicators.',
                'status' => 'Featured inventory',
            ],
        ];
    }

    /**
     * @param array<string, mixed> $data
     */
    public function insert_interest(array $data): int
    {
        global $wpdb;

        $wpdb->insert(
            $this->interests_table(),
            [
                'listing_id' => absint($data['listing_id'] ?? 0),
                'user_id' => get_current_user_id() ?: null,
                'buyer_name' => (string) ($data['buyer_name'] ?? ''),
                'buyer_email' => (string) ($data['buyer_email'] ?? ''),
                'offer_amount' => isset($data['offer_amount']) ? (float) $data['offer_amount'] : null,
                'message' => (string) ($data['message'] ?? ''),
                'status' => 'new',
                'created_at' => current_time('mysql'),
            ],
            ['%d', '%d', '%s', '%s', '%f', '%s', '%s', '%s']
        );

        return (int) $wpdb->insert_id;
    }

    public function record_nda_acceptance(int $listing_id, int $user_id, string $ip_hash = ''): void
    {
        global $wpdb;

        $wpdb->replace(
            $this->nda_table(),
            [
                'listing_id' => $listing_id,
                'user_id' => $user_id,
                'accepted_at' => current_time('mysql'),
                'ip_hash' => $ip_hash,
            ],
            ['%d', '%d', '%s', '%s']
        );
    }

    /**
     * @param array<string, mixed> $context
     */
    public function insert_audit_log(string $action, string $object_type = '', int $object_id = 0, array $context = []): int
    {
        global $wpdb;

        $wpdb->insert(
            $this->audit_table(),
            [
                'user_id' => get_current_user_id() ?: null,
                'action' => $action,
                'object_type' => $object_type,
                'object_id' => $object_id ?: null,
                'context' => wp_json_encode($context),
                'created_at' => current_time('mysql'),
            ],
            ['%d', '%s', '%s', '%d', '%s', '%s']
        );

        return (int) $wpdb->insert_id;
    }
}
