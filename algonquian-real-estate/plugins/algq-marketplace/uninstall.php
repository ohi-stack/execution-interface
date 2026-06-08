<?php
/**
 * Safe uninstall cleanup for Algonquian Deal Marketplace.
 */

declare(strict_types=1);

 * Non-destructive uninstall routine for Algonquian Deal Marketplace.
 *
 * Marketplace data is retained by default. Tables, generated pages, and options
 * are removed only when the administrator explicitly enables the
 * cleanup_on_uninstall option before uninstalling.
 * Uninstall handler for Algonquian Deal Marketplace.
 *
 * The plugin is intentionally non-destructive by default. Marketplace tables,
 * generated page references, and settings are removed only when the
 * delete-data-on-uninstall option has been explicitly enabled by an admin.
 *
 * @package Algonquian_Deal_Marketplace
 */

if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

require_once __DIR__ . '/algq-marketplace.php';

$settings = function_exists('algq_marketplace_get_settings') ? algq_marketplace_get_settings() : [];

if (($settings['cleanup_generated_pages'] ?? 'no') === 'yes' && class_exists('ALGQ_Marketplace_Pages')) {
    ALGQ_Marketplace_Pages::maybe_delete_generated_pages();
}

if (($settings['cleanup_tables'] ?? 'no') === 'yes' && class_exists('ALGQ_Marketplace_DB')) {
    ALGQ_Marketplace_DB::drop_tables();
}

if (class_exists('ALGQ_Marketplace_Roles')) {
    ALGQ_Marketplace_Roles::remove_caps();
}

delete_transient('algq_marketplace_cache');
delete_site_transient('algq_marketplace_cache');

if (($settings['cleanup_options'] ?? 'yes') === 'yes') {
    delete_option(ALGQ_MARKETPLACE_OPTION_SETTINGS);
    delete_option(ALGQ_MARKETPLACE_OPTION_PAGES);
    delete_option(ALGQ_MARKETPLACE_OPTION_DB_VERSION);
    delete_option(ALGQ_MARKETPLACE_OPTION_CLEANUP);
}
$options = get_option('algq_deal_marketplace_options', []);
$cleanup_enabled = is_array($options) && !empty($options['cleanup_on_uninstall']);

if (!$cleanup_enabled) {
    return;
}

$page_id = (int) get_option('algq_deal_marketplace_page_id', 0);

if ($page_id > 0 && function_exists('wp_delete_post')) {
    wp_delete_post($page_id, true);
}

global $wpdb;

if (isset($wpdb) && method_exists($wpdb, 'query')) {
    $tables = [
        $wpdb->prefix . 'algq_deal_marketplace_listings',
        $wpdb->prefix . 'algq_deal_marketplace_interests',
        $wpdb->prefix . 'algq_deal_marketplace_ndas',
        $wpdb->prefix . 'algq_deal_marketplace_audit_log',
    ];

    foreach ($tables as $table) {
        $wpdb->query('DROP TABLE IF EXISTS ' . esc_sql($table));
    }
$algq_deal_marketplace_options = get_option('algq_deal_marketplace_options', []);

if (!is_array($algq_deal_marketplace_options) || '1' !== (string) ($algq_deal_marketplace_options['delete_data_on_uninstall'] ?? '0')) {
    return;
}

global $wpdb;

$algq_deal_marketplace_tables = [
    $wpdb->prefix . 'algq_deal_marketplace_listings',
    $wpdb->prefix . 'algq_deal_marketplace_interests',
    $wpdb->prefix . 'algq_deal_marketplace_ndas',
    $wpdb->prefix . 'algq_deal_marketplace_audit_log',
];

foreach ($algq_deal_marketplace_tables as $algq_deal_marketplace_table) {
    $wpdb->query('DROP TABLE IF EXISTS ' . esc_sql($algq_deal_marketplace_table));
}

delete_option('algq_deal_marketplace_options');
delete_option('algq_deal_marketplace_page_id');
delete_option('algq_marketplace_page_id');
