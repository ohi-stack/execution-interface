<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

class ALGQ_Marketplace_Plugin
{
    private static $instance;

    public static function instance(): self
    {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function init(): void
    {
        (new ALGQ_Marketplace_Shortcodes())->register();
        (new ALGQ_Marketplace_Admin())->register();
        add_action('wp_enqueue_scripts', [$this, 'public_assets']);
        add_action('rest_api_init', [$this, 'rest_routes']);
    }

    public function public_assets(): void
    {
        wp_enqueue_style('algq-marketplace-public', ALGQ_MARKETPLACE_URL . 'assets/css/algq-marketplace-public.css', [], ALGQ_MARKETPLACE_VERSION);
        wp_enqueue_script('algq-marketplace-public', ALGQ_MARKETPLACE_URL . 'assets/js/algq-marketplace-public.js', [], ALGQ_MARKETPLACE_VERSION, true);
        wp_localize_script('algq-marketplace-public', 'ALGQMarketplacePublic', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('algq_marketplace_public_ajax'),
        ]);
    }

    public function rest_routes(): void
    {
        register_rest_route('algq/v1', '/marketplace', [
            'methods' => 'GET',
            'permission_callback' => static function (): bool {
                return current_user_can('view_algq_marketplace') || current_user_can('manage_algq_marketplace');
            },
            'callback' => static function (): WP_REST_Response {
                return new WP_REST_Response([
                    'name' => 'Algonquian Deal Marketplace',
                    'version' => ALGQ_MARKETPLACE_VERSION,
                    'shortcodes' => ['algq_deal_marketplace', 'algq_marketplace_deals', 'algq_marketplace_deal', 'algq_marketplace_nda_gate', 'algq_buyer_dashboard', 'algq_buyer_interest_form'],
                ]);
            },
        ]);
    }
}
