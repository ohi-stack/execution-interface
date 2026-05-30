<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Intake_Activator
{
    public static function activate(): void
    {
        global $wpdb;

        $table = ALGQ_Deal_Intake_Repository::table_name();
        $charset = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE {$table} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            deal_id varchar(32) NOT NULL,
            seller_name varchar(191) NOT NULL,
            seller_phone varchar(64) NOT NULL,
            seller_email varchar(191) DEFAULT '',
            address text NOT NULL,
            asking_price decimal(12,2) DEFAULT 0,
            condition_notes longtext NULL,
            lead_source varchar(120) DEFAULT 'website',
            motivation_score tinyint(3) unsigned DEFAULT 0,
            motivation_signals longtext NULL,
            property_tags longtext NULL,
            status varchar(40) DEFAULT 'new',
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY  (id),
            UNIQUE KEY deal_id (deal_id),
            KEY status (status),
            KEY lead_source (lead_source),
            KEY motivation_score (motivation_score)
        ) {$charset};";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }
}
