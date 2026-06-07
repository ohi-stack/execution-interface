<?php
/**
 * Page provisioning for Deal Marketplace.
 *
 * @package Algonquian_Deal_Marketplace
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Marketplace_Pages
{
    public const OPTION_PAGE_ID = 'algq_deal_marketplace_page_id';

    /**
     * @return array<int, array{slug: string, title: string, content: string, option_name: string}>
     */
    public static function generated_pages(): array
    {
        return [
            [
                'slug' => 'deal-marketplace',
                'title' => 'Deal Marketplace',
                'content' => '[algq_marketplace]',
                'option_name' => self::OPTION_PAGE_ID,
            ],
        ];
    }

    public static function create_default_pages(): void
    {
        if (!function_exists('wp_insert_post')) {
            return;
        }

        foreach (self::generated_pages() as $page_definition) {
            $existing_page_id = absint(get_option($page_definition['option_name'], 0));

            if ($existing_page_id && get_post($existing_page_id)) {
                continue;
            }

            $page = get_page_by_path($page_definition['slug']);

            if ($page) {
                update_option($page_definition['option_name'], (int) $page->ID);
                continue;
            }

            $page_id = wp_insert_post([
                'post_title' => __($page_definition['title'], ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN),
                'post_name' => $page_definition['slug'],
                'post_type' => 'page',
                'post_status' => 'publish',
                'post_content' => $page_definition['content'],
            ]);

            if (!is_wp_error($page_id)) {
                update_option($page_definition['option_name'], (int) $page_id);
            }
        }
    }
}
