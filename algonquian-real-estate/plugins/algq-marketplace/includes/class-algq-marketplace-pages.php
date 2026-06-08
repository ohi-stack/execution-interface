<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

class ALGQ_Marketplace_Pages
{
    public static function definitions(): array
    {
        return [
            'deal_marketplace' => ['title' => __('Deal Marketplace', 'algq-marketplace'), 'slug' => 'deal-marketplace', 'shortcode' => '[algq_deal_marketplace]'],
            'buyer_deals' => ['title' => __('Buyer Deals', 'algq-marketplace'), 'slug' => 'buyer-deals', 'shortcode' => '[algq_marketplace_deals]'],
            'buyer_dashboard' => ['title' => __('Buyer Dashboard', 'algq-marketplace'), 'slug' => 'buyer-dashboard', 'shortcode' => '[algq_buyer_dashboard]'],
            'nda_gate' => ['title' => __('NDA Gate', 'algq-marketplace'), 'slug' => 'nda-gate', 'shortcode' => '[algq_marketplace_nda_gate]'],
            'submit_interest' => ['title' => __('Submit Interest', 'algq-marketplace'), 'slug' => 'submit-interest', 'shortcode' => '[algq_buyer_interest_form]'],
            'documentation' => ['title' => __('Marketplace Documentation / Getting Started', 'algq-marketplace'), 'slug' => 'marketplace-documentation', 'shortcode' => '[algq_deal_marketplace view="documentation"]'],
        ];
    }

    public static function generate_pages(): array
    {
        $generated = get_option(ALGQ_MARKETPLACE_OPTION_PAGES, []);
        $generated = is_array($generated) ? $generated : [];

        foreach (self::definitions() as $key => $page) {
            $existing = get_page_by_path($page['slug']);
            $page_id = $existing ? (int) $existing->ID : 0;

            if ($page_id <= 0) {
                $page_id = (int) wp_insert_post([
                    'post_title' => sanitize_text_field($page['title']),
                    'post_name' => sanitize_title($page['slug']),
                    'post_content' => $page['shortcode'],
                    'post_status' => 'publish',
                    'post_type' => 'page',
                    'comment_status' => 'closed',
                ]);
            } elseif (strpos((string) get_post_field('post_content', $page_id), $page['shortcode']) === false) {
                wp_update_post([
                    'ID' => $page_id,
                    'post_content' => trim((string) get_post_field('post_content', $page_id)) . "\n\n" . $page['shortcode'],
                ]);
            }

            if ($page_id > 0 && !is_wp_error($page_id)) {
                $generated[$key] = ['id' => $page_id, 'shortcode' => $page['shortcode'], 'slug' => $page['slug']];
            }
        }

        update_option(ALGQ_MARKETPLACE_OPTION_PAGES, $generated);
        return $generated;
    }

    public static function maybe_delete_generated_pages(): void
    {
        $settings = algq_marketplace_get_settings();
        if (($settings['cleanup_generated_pages'] ?? 'no') !== 'yes') {
            return;
        }

        $generated = get_option(ALGQ_MARKETPLACE_OPTION_PAGES, []);
        if (!is_array($generated)) {
            return;
        }

        foreach ($generated as $page) {
            $page_id = isset($page['id']) ? absint($page['id']) : 0;
            if ($page_id > 0) {
                wp_delete_post($page_id, true);
            }
        }
    }
}
