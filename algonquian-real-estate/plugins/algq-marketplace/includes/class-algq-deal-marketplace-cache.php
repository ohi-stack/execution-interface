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
    public const GROUP = 'algq_deal_marketplace';
    public const PREFIX = 'algq_dmp_';
    public const OPTION_KEYS = 'algq_deal_marketplace_cache_keys';
    public const OPTION_VERSION = 'algq_deal_marketplace_cache_version';

    public const TTL_LISTINGS = 300;
    public const TTL_DASHBOARD = 120;
    public const TTL_SETTINGS = 1800;
    public const TTL_NDA_STATUS = 600;

    /**
     * Register cache invalidation hooks.
     */
    public function register_hooks(): void
    {
        add_action('save_post_algq_deal_marketplace', [$this, 'flush_group']);
        add_action('save_post_algq_marketplace_deal', [$this, 'flush_group']);
        add_action('save_post_deal', [$this, 'flush_group']);
        add_action('deleted_post', [$this, 'handle_deleted_post']);
        add_action('algq_deal_marketplace_interest_submitted', [$this, 'flush_group']);
        add_action('algq_deal_marketplace_nda_accepted', [$this, 'flush_group']);
        add_action('update_option_algq_deal_marketplace_options', [$this, 'flush_group']);
        add_action('plugins_loaded', [$this, 'maybe_flush_on_version_change'], 30);
    }

    /**
     * @param mixed $key
     * @return mixed
     */
    public function get($key, $group = self::GROUP)
    {
        if (!$this->is_enabled()) {
            return false;
        }

        $cache_key = $this->build_key($key);
        $found = false;

        if (function_exists('wp_cache_get')) {
            $value = wp_cache_get($cache_key, $group, false, $found);

            if ($found || false !== $value) {
                return $value;
            }
        }

        if (function_exists('get_transient')) {
            return get_transient($cache_key);
        }

        return false;
    }

    /**
     * @param mixed $key
     * @param mixed $value
     */
    public function set($key, $value, $ttl = self::TTL_LISTINGS, $group = self::GROUP): bool
    {
        if (!$this->is_enabled()) {
            return false;
        }

        $ttl = $this->normalize_ttl($ttl);
        $cache_key = $this->build_key($key);
        $stored = false;

        if (function_exists('wp_cache_set')) {
            $stored = (bool) wp_cache_set($cache_key, $value, $group, $ttl);
        }

        if (function_exists('set_transient')) {
            $stored = (bool) set_transient($cache_key, $value, $ttl) || $stored;
        }

        $this->remember_key($cache_key, $group);

        return $stored;
    }

    /**
     * @param mixed $key
     */
    public function delete($key, $group = self::GROUP): void
    {
        $cache_key = self::PREFIX . $key;
        $value = function_exists('wp_cache_get') ? wp_cache_get($cache_key, self::GROUP) : false;
        $cache_key = $this->build_key($key);

        if (function_exists('wp_cache_delete')) {
            wp_cache_delete($cache_key, $group);
        }

        return function_exists('get_transient') ? get_transient($cache_key) : false;
        if (function_exists('delete_transient')) {
            delete_transient($cache_key);
        }

        $this->forget_key($cache_key, $group);
    }

    /**
     * @param mixed $key
     * @return mixed
     */
    public function remember($key, callable $callback, $ttl = self::TTL_LISTINGS, $group = self::GROUP)
    {
        $cached = $this->get($key, $group);

        if (false !== $cached) {
            return $cached;
        }

        $value = $callback();
        $this->set($key, $value, $ttl, $group);

        return $value;
    }

    /**
     * Clear all known marketplace cache keys.
     */
    public function flush_group(): void
    {
        if (function_exists('wp_cache_flush_group')) {
            wp_cache_flush_group(self::GROUP);
        }

        foreach ($this->registered_keys() as $group => $keys) {
            if (!is_array($keys)) {
                continue;
            }

            foreach (array_keys($keys) as $cache_key) {
                if (function_exists('wp_cache_delete')) {
                    wp_cache_delete($cache_key, (string) $group);
                }

                if (function_exists('delete_transient')) {
                    delete_transient($cache_key);
                }
            }
        }

        if (function_exists('delete_option')) {
            delete_option(self::OPTION_KEYS);
        }
    }

    /**
     * @param mixed $parts
     */
    public function build_key($parts): string
    {
        $cache_key = self::PREFIX . $key;
        if (function_exists('wp_cache_set')) {
            wp_cache_set($cache_key, $value, self::GROUP, $ttl);
        }

        return function_exists('set_transient') ? set_transient($cache_key, $value, $ttl) : true;
        if (is_array($parts)) {
            $parts = implode('_', array_map(function ($part): string {
                if (is_scalar($part) || null === $part) {
                    return (string) $part;
                }

                return md5($this->encode($part));
            }, $parts));
        } elseif (!is_scalar($parts) && null !== $parts) {
            $parts = md5($this->encode($parts));
        }

        $key = $this->sanitize_cache_key((string) $parts);

        if (0 === strpos($key, self::PREFIX)) {
            return $key;
        }

        return self::PREFIX . $key;
    }

    public function ttl_for(string $type): int
    {
        $cache_key = self::PREFIX . $key;
        if (function_exists('wp_cache_delete')) {
            wp_cache_delete($cache_key, self::GROUP);
        }

        if (function_exists('delete_transient')) {
            delete_transient($cache_key);
        switch ($type) {
            case 'settings':
                return self::TTL_SETTINGS;
            case 'nda':
                return self::TTL_NDA_STATUS;
            case 'dashboard':
            case 'summary':
            case 'kpi':
                return self::TTL_DASHBOARD;
            case 'listings':
            case 'featured':
            default:
                return $this->default_ttl();
        }
    }

    public function is_enabled(): bool
    {
        $options = $this->options();
        return !isset($options['caching_enabled']) || '0' !== (string) $options['caching_enabled'];
    }

    public function default_ttl(): int
    {
        $options = $this->options();
        return $this->normalize_ttl($options['default_cache_ttl'] ?? self::TTL_LISTINGS);
    }

    public function handle_deleted_post(int $post_id): void
    {
        $post_type = function_exists('get_post_type') ? (string) get_post_type($post_id) : '';

        if (in_array($post_type, ['algq_deal_marketplace', 'algq_marketplace_deal', 'deal'], true)) {
            $this->flush_group();
        }
    }

    public function maybe_flush_on_version_change(): void
    {
        if (!function_exists('get_option') || !function_exists('update_option') || !defined('ALGQ_DEAL_MARKETPLACE_VERSION')) {
            return;
        }

        $version = (string) get_option(self::OPTION_VERSION, '');

        if (ALGQ_DEAL_MARKETPLACE_VERSION !== $version) {
            $this->flush_group();
            update_option(self::OPTION_VERSION, ALGQ_DEAL_MARKETPLACE_VERSION, false);
        }
    }

    private function normalize_ttl($ttl): int
    {
        $ttl = function_exists('absint') ? absint($ttl) : abs( (int) $ttl );
        return $ttl > 0 ? $ttl : self::TTL_LISTINGS;
    }

    /**
     * @param mixed $value
     */
    private function encode($value): string
    {
        if (function_exists('wp_json_encode')) {
            return (string) wp_json_encode($value);
        }

        return (string) json_encode($value);
    }

    private function sanitize_cache_key(string $key): string
    {
        if (function_exists('sanitize_key')) {
            return sanitize_key($key);
        }

        return preg_replace('/[^a-z0-9_\-]/', '', strtolower($key)) ?: '';
    }

    /**
     * @return array<string, mixed>
     */
    private function options(): array
    {
        if (!function_exists('get_option')) {
            return [];
        }

        $options = get_option('algq_deal_marketplace_options', []);
        return is_array($options) ? $options : [];
    }

    /**
     * @return array<string, array<string, bool>>
     */
    private function registered_keys(): array
    {
        if (!function_exists('get_option')) {
            return [];
        }

        $keys = get_option(self::OPTION_KEYS, []);
        return is_array($keys) ? $keys : [];
    }

    private function remember_key(string $cache_key, string $group): void
    {
        if (!function_exists('update_option')) {
            return;
        }

        $keys = $this->registered_keys();
        $keys[$group] = isset($keys[$group]) && is_array($keys[$group]) ? $keys[$group] : [];
        $keys[$group][$cache_key] = true;

        update_option(self::OPTION_KEYS, $keys, false);
    }

    private function forget_key(string $cache_key, string $group): void
    {
        if (!function_exists('update_option')) {
            return;
        }

        $keys = $this->registered_keys();

        if (isset($keys[$group][$cache_key])) {
            unset($keys[$group][$cache_key]);
            update_option(self::OPTION_KEYS, $keys, false);
        }
    }
}
