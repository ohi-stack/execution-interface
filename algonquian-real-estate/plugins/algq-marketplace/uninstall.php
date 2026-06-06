<?php
/**
 * Non-destructive uninstall routine for Algonquian Deal Marketplace.
 *
 * Marketplace data is retained by default. Tables, generated pages, and options
 * are removed only when the administrator explicitly enables the
 * cleanup_on_uninstall option before uninstalling.
 *
 * @package Algonquian_Deal_Marketplace
 */

if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
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
}

delete_option('algq_deal_marketplace_options');
delete_option('algq_deal_marketplace_page_id');
