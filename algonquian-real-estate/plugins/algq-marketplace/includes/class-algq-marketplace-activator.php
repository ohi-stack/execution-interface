<?php
/**
 * Activation routines for Algonquian Marketplace.
 *
 * @package AlgqMarketplace
 */

if (!defined('ABSPATH')) {
    exit;
}

class Algq_Marketplace_Activator
{
    /**
     * @return array<string, array<int, string>>
     */
    public static function capabilities(): array
    {
        return [
            'administrator' => [
                'algq_manage_marketplace',
                'algq_publish_marketplace_deals',
                'algq_view_marketplace_reports',
            ],
            'algq_marketplace_manager' => [
                'read',
                'algq_manage_marketplace',
                'algq_publish_marketplace_deals',
                'algq_view_marketplace_reports',
            ],
            'algq_investor' => [
                'read',
                'algq_view_marketplace_deals',
            ],
        ];
    }

    /**
     * @return array<int, array{slug: string, title: string, content: string, option_name: string}>
     */
    public static function generated_pages(): array
    {
        return [
            [
                'slug' => 'are-marketplace',
                'title' => 'ARE Marketplace',
                'content' => '[algq_marketplace]',
                'option_name' => 'algq_marketplace_page_id',
            ],
        ];
    }

    public static function activate(): void
    {
        self::add_capabilities();
        self::create_generated_pages();
    }

    private static function add_capabilities(): void
    {
        if (!function_exists('get_role')) {
            return;
        }

        foreach (self::capabilities() as $role_name => $capabilities) {
            $role = get_role($role_name);

            if (!$role && 'algq_marketplace_manager' === $role_name && function_exists('add_role')) {
                $role = add_role($role_name, 'Marketplace Manager', ['read' => true]);
            }

            if (!$role && 'algq_investor' === $role_name && function_exists('add_role')) {
                $role = add_role($role_name, 'Marketplace Investor', ['read' => true]);
            }

            if (!$role || !method_exists($role, 'add_cap')) {
                continue;
            }

            foreach ($capabilities as $capability) {
                $role->add_cap($capability);
            }
        }
    }

    private static function create_generated_pages(): void
    {
        if (!function_exists('get_option') || !function_exists('wp_insert_post')) {
            return;
        }

        foreach (self::generated_pages() as $page) {
            $existing_page_id = (int) get_option($page['option_name']);

            if ($existing_page_id > 0 && 'trash' !== get_post_status($existing_page_id)) {
                continue;
            }

            $page_id = wp_insert_post([
                'post_name' => $page['slug'],
                'post_title' => $page['title'],
                'post_content' => $page['content'],
                'post_status' => 'publish',
                'post_type' => 'page',
            ], true);

            if (!is_wp_error($page_id) && $page_id > 0 && function_exists('update_option')) {
                update_option($page['option_name'], (int) $page_id);
            }
        }
    }
}
