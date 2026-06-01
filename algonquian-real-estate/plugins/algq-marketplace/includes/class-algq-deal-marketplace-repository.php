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
    private ?ALGQ_Deal_Marketplace_Cache $cache;

    public function __construct(?ALGQ_Deal_Marketplace_Cache $cache = null)
    {
        $this->cache = $cache;
    }

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
        return $this->remember(['listings', 'active'], function (): array {
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
        }, ALGQ_Deal_Marketplace_Cache::TTL_LISTINGS);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function get_featured_deals(): array
    {
        return $this->remember(['listings', 'featured'], function (): array {
            global $wpdb;

            $rows = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT * FROM {$this->listings_table()} WHERE status = %s AND (visibility = %s OR meta LIKE %s) ORDER BY updated_at DESC LIMIT 12",
                    'active',
                    'featured',
                    '%"featured":true%'
                ),
                ARRAY_A
            );

            return is_array($rows) ? $rows : [];
        }, ALGQ_Deal_Marketplace_Cache::TTL_LISTINGS);
    }

    /**
     * @return array<string, mixed>
     */
    public function get_buyer_dashboard_summary(int $user_id): array
    {
        return $this->remember(['dashboard', 'buyer', $user_id], function () use ($user_id): array {
            global $wpdb;

            $interest_count = (int) $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT COUNT(*) FROM {$this->interests_table()} WHERE user_id = %d",
                    $user_id
                )
            );
            $nda_count = (int) $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT COUNT(*) FROM {$this->nda_table()} WHERE user_id = %d",
                    $user_id
                )
            );

            return [
                'user_id' => $user_id,
                'submitted_interest_count' => $interest_count,
                'accepted_nda_count' => $nda_count,
            ];
        }, ALGQ_Deal_Marketplace_Cache::TTL_DASHBOARD);
    }

    public function has_accepted_nda(int $listing_id, int $user_id): bool
    {
        return (bool) $this->remember(['nda', $listing_id, $user_id], function () use ($listing_id, $user_id): bool {
            global $wpdb;

            return (bool) $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT id FROM {$this->nda_table()} WHERE listing_id = %d AND user_id = %d LIMIT 1",
                    $listing_id,
                    $user_id
                )
            );
        }, ALGQ_Deal_Marketplace_Cache::TTL_NDA_STATUS);
    }

    /**
     * @return array<string, int>
     */
    public function get_dashboard_kpi_counts(): array
    {
        return $this->remember(['dashboard', 'kpis'], function (): array {
            global $wpdb;

            return [
                'active_listings' => (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$this->listings_table()} WHERE status = %s", 'active')),
                'featured_deals' => (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$this->listings_table()} WHERE status = %s AND (visibility = %s OR meta LIKE %s)", 'active', 'featured', '%"featured":true%')),
                'buyer_interests' => (int) $wpdb->get_var("SELECT COUNT(*) FROM {$this->interests_table()}"),
                'accepted_ndas' => (int) $wpdb->get_var("SELECT COUNT(*) FROM {$this->nda_table()}"),
            ];
        }, ALGQ_Deal_Marketplace_Cache::TTL_DASHBOARD);
    }

    /**
     * @return array<int, array{label: string, value: int}>
     */
    public function get_admin_summary_cards(): array
    {
        $counts = $this->get_dashboard_kpi_counts();

        return $this->remember(['admin', 'summary_cards'], static function () use ($counts): array {
            return [
                ['label' => 'Active listings', 'value' => $counts['active_listings'] ?? 0],
                ['label' => 'Featured deals', 'value' => $counts['featured_deals'] ?? 0],
                ['label' => 'Buyer interests', 'value' => $counts['buyer_interests'] ?? 0],
                ['label' => 'Accepted NDAs', 'value' => $counts['accepted_ndas'] ?? 0],
            ];
        }, ALGQ_Deal_Marketplace_Cache::TTL_DASHBOARD);
    }

    /**
     * @return array<string, mixed>
     */
    public function get_settings(): array
    {
        return $this->remember(['settings'], static function (): array {
            $options = get_option('algq_deal_marketplace_options', []);
            return is_array($options) ? $options : [];
        }, ALGQ_Deal_Marketplace_Cache::TTL_SETTINGS);
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
     * @param mixed $key
     * @return mixed
     */
    private function remember($key, callable $callback, int $ttl)
    {
        if ($this->cache instanceof ALGQ_Deal_Marketplace_Cache) {
            return $this->cache->remember($key, $callback, $ttl);
        }

        return $callback();
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
