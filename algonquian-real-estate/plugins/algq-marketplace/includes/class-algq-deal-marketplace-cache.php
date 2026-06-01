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
        $value = wp_cache_get($cache_key, self::GROUP);

        if (false !== $value) {
            return $value;
        }

        return get_transient($cache_key);
    }

    public function set(string $key, $value, int $ttl = 300): bool
    {
        $cache_key = self::PREFIX . $key;
        wp_cache_set($cache_key, $value, self::GROUP, $ttl);
        return set_transient($cache_key, $value, $ttl);
    }

    public function delete(string $key): void
    {
        $cache_key = self::PREFIX . $key;
        wp_cache_delete($cache_key, self::GROUP);
        delete_transient($cache_key);
    }

    public function flush_marketplace(): void
    {
        $this->delete('active_listings');
        $this->delete('integrations');
    }
}
