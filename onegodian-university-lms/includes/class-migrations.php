<?php

if (! defined('ABSPATH')) {
    exit;
}

class OG_LMS_Migrations
{
    private const OPTION_NAME = 'og_lms_schema_version';
    private const TARGET_VERSION = '1.1.0';

    public static function run(): void
    {
        $current = (string) get_option(self::OPTION_NAME, '0.0.0');
        $migrations = [
            '1.0.0' => [self::class, 'migrate_1_0_0'],
            '1.1.0' => [self::class, 'migrate_1_1_0'],
        ];

        foreach ($migrations as $version => $callback) {
            if (version_compare($current, $version, '>=')) {
                continue;
            }

            call_user_func($callback);
            update_option(self::OPTION_NAME, $version, false);
            $current = $version;
        }

        if (version_compare($current, self::TARGET_VERSION, '<')) {
            update_option(self::OPTION_NAME, self::TARGET_VERSION, false);
        }
    }

    private static function migrate_1_0_0(): void
    {
        OG_LMS_DB_Schema::create_tables();
    }

    private static function migrate_1_1_0(): void
    {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        $charset = $wpdb->get_charset_collate();
        $prefix = $wpdb->prefix;

        $sql = "CREATE TABLE {$prefix}og_memberships (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            user_id BIGINT UNSIGNED NOT NULL,
            tier VARCHAR(40) NOT NULL DEFAULT 'starter',
            status VARCHAR(40) NOT NULL DEFAULT 'inactive',
            stripe_customer_id VARCHAR(128) NULL,
            stripe_subscription_id VARCHAR(128) NULL,
            renews_at DATETIME NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY user_id (user_id),
            KEY stripe_customer_id (stripe_customer_id),
            KEY status (status)
        ) {$charset};";

        dbDelta($sql);
    }
}
