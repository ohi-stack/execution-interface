<?php
/**
 * Asset registration for Deal Marketplace.
 *
 * @package Algonquian_Deal_Marketplace
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Marketplace_Assets
{
    public function register_hooks(): void
    {
        add_action('wp_enqueue_scripts', [$this, 'register_public_assets']);

        if (is_admin()) {
            add_action('admin_enqueue_scripts', [$this, 'enqueue_admin']);
        }
    }

    public function register_public_assets(): void
    {
        wp_register_style(
            'algq-deal-marketplace',
            ALGQ_DEAL_MARKETPLACE_URL . 'assets/css/deal-marketplace.css',
            [],
            ALGQ_DEAL_MARKETPLACE_VERSION
        );

        wp_register_script(
            'algq-deal-marketplace',
            ALGQ_DEAL_MARKETPLACE_URL . 'assets/js/deal-marketplace.js',
            [],
            ALGQ_DEAL_MARKETPLACE_VERSION,
            true
        );
    }

    public function enqueue_public(): void
    {
        if (!wp_style_is('algq-deal-marketplace', 'registered')) {
            $this->register_public_assets();
        }

        wp_enqueue_style('algq-deal-marketplace');
        wp_enqueue_script('algq-deal-marketplace');
    }

    public function enqueue_admin(string $hook_suffix = ''): void
    {
        if (false === strpos($hook_suffix, 'algq-deal-marketplace')) {
            return;
        }

        wp_enqueue_style(
            'algq-deal-marketplace-admin',
            ALGQ_DEAL_MARKETPLACE_URL . 'assets/css/deal-marketplace-admin.css',
            [],
            ALGQ_DEAL_MARKETPLACE_VERSION
        );
    }
}
