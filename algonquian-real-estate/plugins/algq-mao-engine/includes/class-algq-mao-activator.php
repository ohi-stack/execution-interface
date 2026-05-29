<?php

if (! defined('ABSPATH')) {
    exit;
}

class ALGQ_MAO_Activator
{
    public static function activate(): void
    {
        global $wpdb;

        $table_name = self::table_name();
        $charset_collate = $wpdb->get_charset_collate();

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        $sql = "CREATE TABLE {$table_name} (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            deal_name varchar(191) NOT NULL DEFAULT '',
            property_address varchar(255) NOT NULL DEFAULT '',
            lead_source varchar(120) NOT NULL DEFAULT '',
            arv decimal(14,2) NOT NULL DEFAULT 0,
            repairs decimal(14,2) NOT NULL DEFAULT 0,
            closing_costs decimal(14,2) NOT NULL DEFAULT 0,
            holding_costs decimal(14,2) NOT NULL DEFAULT 0,
            selling_costs decimal(14,2) NOT NULL DEFAULT 0,
            financing_costs decimal(14,2) NOT NULL DEFAULT 0,
            desired_profit decimal(14,2) NOT NULL DEFAULT 0,
            wholesale_fee decimal(14,2) NOT NULL DEFAULT 0,
            safety_buffer decimal(14,2) NOT NULL DEFAULT 0,
            maximum_allowable_offer decimal(14,2) NOT NULL DEFAULT 0,
            offer_low decimal(14,2) NOT NULL DEFAULT 0,
            offer_high decimal(14,2) NOT NULL DEFAULT 0,
            offer_percent decimal(8,4) NOT NULL DEFAULT 0,
            inputs longtext NOT NULL,
            created_by bigint(20) unsigned NOT NULL DEFAULT 0,
            created_at datetime NOT NULL,
            PRIMARY KEY  (id),
            KEY created_at (created_at),
            KEY created_by (created_by)
        ) {$charset_collate};";

        dbDelta($sql);

        add_option('algq_mao_engine_version', ALGQ_MAO_ENGINE_VERSION);
    }

    public static function deactivate(): void
    {
        flush_rewrite_rules();
    }

    public static function table_name(): string
    {
        global $wpdb;

        return $wpdb->prefix . 'algq_mao_calculations';
    }
}
