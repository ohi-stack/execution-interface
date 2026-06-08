<?php
/**
 * Safe uninstall cleanup for Algonquian Deal Marketplace.
 */

declare(strict_types=1);

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
