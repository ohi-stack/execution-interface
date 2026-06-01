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

    public static function create_default_pages(): void
    {
        if (!function_exists('wp_insert_post')) {
            return;
        }

        $existing_page_id = absint(get_option(self::OPTION_PAGE_ID, 0));

        if ($existing_page_id && get_post($existing_page_id)) {
            return;
        }

        $page = get_page_by_path('deal-marketplace');

        if ($page) {
            update_option(self::OPTION_PAGE_ID, (int) $page->ID);
            return;
        }

        $page_id = wp_insert_post([
            'post_title' => __('Deal Marketplace', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN),
            'post_name' => 'deal-marketplace',
            'post_type' => 'page',
            'post_status' => 'publish',
            'post_content' => '[algq_marketplace]',
        ]);

        if (!is_wp_error($page_id)) {
            update_option(self::OPTION_PAGE_ID, (int) $page_id);
        }
    }
}
