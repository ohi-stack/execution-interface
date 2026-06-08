<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

class ALGQ_Marketplace_DB
{
    public static function create_tables(): void
    {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        $charset = $wpdb->get_charset_collate();
        $buyer_offers = algq_marketplace_table_name('buyer_offers');
        $nda = algq_marketplace_table_name('nda_acceptances');
        $access = algq_marketplace_table_name('access_logs');
        $activity = algq_marketplace_table_name('activity_log');

        dbDelta("CREATE TABLE {$buyer_offers} (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            deal_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
            user_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
            buyer_name VARCHAR(190) NOT NULL DEFAULT '',
            buyer_email VARCHAR(190) NOT NULL DEFAULT '',
            buyer_phone VARCHAR(40) NOT NULL DEFAULT '',
            offer_amount DECIMAL(14,2) NOT NULL DEFAULT 0.00,
            notes LONGTEXT NULL,
            status VARCHAR(40) NOT NULL DEFAULT 'new',
            created_at DATETIME NOT NULL,
            updated_at DATETIME NULL,
            PRIMARY KEY  (id),
            KEY deal_id (deal_id),
            KEY user_id (user_id),
            KEY status (status)
        ) {$charset};");

        dbDelta("CREATE TABLE {$nda} (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            deal_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
            user_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
            signer_name VARCHAR(190) NOT NULL DEFAULT '',
            signer_email VARCHAR(190) NOT NULL DEFAULT '',
            accepted_version VARCHAR(40) NOT NULL DEFAULT '1.0',
            ip_address VARCHAR(100) NOT NULL DEFAULT '',
            user_agent TEXT NULL,
            accepted_at DATETIME NOT NULL,
            PRIMARY KEY  (id),
            KEY deal_user (deal_id, user_id),
            KEY user_id (user_id)
        ) {$charset};");

        dbDelta("CREATE TABLE {$access} (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            user_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
            deal_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
            action VARCHAR(80) NOT NULL DEFAULT '',
            access_level VARCHAR(40) NOT NULL DEFAULT 'none',
            ip_address VARCHAR(100) NOT NULL DEFAULT '',
            created_at DATETIME NOT NULL,
            PRIMARY KEY  (id),
            KEY user_id (user_id),
            KEY deal_id (deal_id),
            KEY action (action)
        ) {$charset};");

        dbDelta("CREATE TABLE {$activity} (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            event_type VARCHAR(80) NOT NULL DEFAULT '',
            message TEXT NOT NULL,
            context LONGTEXT NULL,
            user_id BIGINT UNSIGNED NOT NULL DEFAULT 0,
            ip_address VARCHAR(100) NOT NULL DEFAULT '',
            created_at DATETIME NOT NULL,
            PRIMARY KEY  (id),
            KEY event_type (event_type),
            KEY user_id (user_id)
        ) {$charset};");

        update_option(ALGQ_MARKETPLACE_OPTION_DB_VERSION, ALGQ_MARKETPLACE_VERSION);
    }

    public static function drop_tables(): void
    {
        global $wpdb;
        foreach (['buyer_offers', 'nda_acceptances', 'access_logs', 'activity_log'] as $suffix) {
            $wpdb->query('DROP TABLE IF EXISTS ' . algq_marketplace_table_name($suffix));
        }
    }
}
