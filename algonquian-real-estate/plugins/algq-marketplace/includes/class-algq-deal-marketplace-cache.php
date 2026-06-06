<?php
/**
 * Cache strategy for Deal Marketplace.
 *
 * @package Algonquian_Deal_Marketplace
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Marketplace_Cache
{
    private const GROUP = 'algq_deal_marketplace';
    private const PREFIX = 'algq_dm_';

    public function get(string $key)
    {
        $cache_key = self::PREFIX . $key;
        $value = function_exists('wp_cache_get') ? wp_cache_get($cache_key, self::GROUP) : false;

        if (false !== $value) {
            return $value;
        }

        return function_exists('get_transient') ? get_transient($cache_key) : false;
    }

    public function set(string $key, $value, int $ttl = 300): bool
    {
        $cache_key = self::PREFIX . $key;
        if (function_exists('wp_cache_set')) {
            wp_cache_set($cache_key, $value, self::GROUP, $ttl);
        }

        return function_exists('set_transient') ? set_transient($cache_key, $value, $ttl) : true;
    }

    public function delete(string $key): void
    {
        $cache_key = self::PREFIX . $key;
        if (function_exists('wp_cache_delete')) {
            wp_cache_delete($cache_key, self::GROUP);
        }

        if (function_exists('delete_transient')) {
            delete_transient($cache_key);
        }
    }

    public function flush_marketplace(): void
    {
        $this->delete('active_listings');
        $this->delete('integrations');
    }
}
