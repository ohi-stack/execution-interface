<?php
/**
 * Activation tasks for Deal Marketplace.
 *
 * @package Algonquian_Deal_Marketplace
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Marketplace_Activator
{
    public static function activate(): void
    {
        if (class_exists('ALGQ_Deal_Marketplace_Capabilities')) {
            ALGQ_Deal_Marketplace_Capabilities::install();
        }

        if (class_exists('ALGQ_Deal_Marketplace_Repository')) {
            $repository = new ALGQ_Deal_Marketplace_Repository();
            $repository->create_tables();
        }

        if (class_exists('ALGQ_Deal_Marketplace_Pages')) {
            ALGQ_Deal_Marketplace_Pages::create_default_pages();
        }

        add_option('algq_deal_marketplace_options', [
            'access_mode' => 'private',
            'caching_enabled' => '1',
            'default_cache_ttl' => (string) ALGQ_Deal_Marketplace_Cache::TTL_LISTINGS,
            'delete_data_on_uninstall' => '0',
        ]);

        flush_rewrite_rules();
    }
}
