<?php
if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Core_Activator
{
    public const ROLES = [
        'algq_acquisition_manager' => 'Acquisition Manager',
        'algq_disposition_manager' => 'Disposition Manager',
        'algq_funding_manager' => 'Funding Manager',
        'algq_administrator' => 'Administrator',
        'algq_investor' => 'Investor',
        'algq_buyer' => 'Buyer',
        'algq_seller' => 'Seller',
        'algq_contractor' => 'Contractor',
    ];

    private const TABLES = [
        'activity_log' => 'algq_activity_log',
        'notifications' => 'algq_notifications',
        'settings' => 'algq_settings',
        'integrations' => 'algq_integrations',
        'licenses' => 'algq_licenses',
    ];

    public static function activate(): void
    {
        self::add_roles();
        self::create_tables();
        update_option('algq_core_version', ALGQ_CORE_VERSION);
    }

    public static function deactivate(): void
    {
        // Preserve platform roles and data on deactivate. Uninstall handling can be added when retention policy is finalized.
    }

    public static function add_roles(): void
    {
        $base_caps = [
            'read' => true,
            'algq_access_platform' => true,
        ];

        foreach (self::ROLES as $role => $label) {
            $caps = $base_caps;
            if ('algq_administrator' === $role) {
                $caps['manage_options'] = true;
                $caps['algq_manage_platform'] = true;
                $caps['algq_manage_integrations'] = true;
                $caps['algq_manage_licenses'] = true;
            }
            add_role($role, $label, $caps);
        }

        $admin = get_role('administrator');
        if ($admin) {
            foreach (['algq_access_platform', 'algq_manage_platform', 'algq_manage_integrations', 'algq_manage_licenses'] as $capability) {
                $admin->add_cap($capability);
            }
        }
    }

    private static function create_tables(): void
    {
        global $wpdb;
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        $charset = $wpdb->get_charset_collate();

        dbDelta("CREATE TABLE {$wpdb->prefix}" . self::TABLES['activity_log'] . " (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            object_type varchar(64) NOT NULL DEFAULT '',
            object_id varchar(64) NOT NULL DEFAULT '',
            deal_id varchar(64) NOT NULL DEFAULT '',
            user_id bigint(20) unsigned NOT NULL DEFAULT 0,
            activity_type varchar(64) NOT NULL,
            activity_note text NOT NULL,
            context longtext NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (id),
            KEY object_lookup (object_type, object_id),
            KEY deal_id (deal_id),
            KEY activity_type (activity_type),
            KEY created_at (created_at)
        ) {$charset};");

        dbDelta("CREATE TABLE {$wpdb->prefix}" . self::TABLES['notifications'] . " (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL DEFAULT 0,
            channel varchar(32) NOT NULL DEFAULT 'dashboard',
            title varchar(191) NOT NULL,
            message text NOT NULL,
            status varchar(32) NOT NULL DEFAULT 'unread',
            context longtext NULL,
            created_at datetime NOT NULL,
            read_at datetime NULL,
            PRIMARY KEY (id),
            KEY user_status (user_id, status),
            KEY channel (channel),
            KEY created_at (created_at)
        ) {$charset};");

        dbDelta("CREATE TABLE {$wpdb->prefix}" . self::TABLES['settings'] . " (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            setting_group varchar(64) NOT NULL DEFAULT 'platform',
            setting_key varchar(191) NOT NULL,
            setting_value longtext NULL,
            autoload varchar(20) NOT NULL DEFAULT 'no',
            updated_at datetime NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY setting_lookup (setting_group, setting_key)
        ) {$charset};");

        dbDelta("CREATE TABLE {$wpdb->prefix}" . self::TABLES['integrations'] . " (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            provider varchar(64) NOT NULL,
            label varchar(191) NOT NULL,
            status varchar(32) NOT NULL DEFAULT 'inactive',
            credentials longtext NULL,
            metadata longtext NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY provider (provider),
            KEY status (status)
        ) {$charset};");

        dbDelta("CREATE TABLE {$wpdb->prefix}" . self::TABLES['licenses'] . " (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            license_key varchar(191) NOT NULL,
            product_slug varchar(191) NOT NULL,
            status varchar(32) NOT NULL DEFAULT 'inactive',
            customer_email varchar(191) NOT NULL DEFAULT '',
            site_url varchar(255) NOT NULL DEFAULT '',
            expires_at datetime NULL,
            metadata longtext NULL,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY license_key (license_key),
            KEY product_status (product_slug, status),
            KEY expires_at (expires_at)
        ) {$charset};");
    }
}
