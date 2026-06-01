<?php
/**
 * Admin UI for Deal Marketplace.
 *
 * @package Algonquian_Deal_Marketplace
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Marketplace_Admin
{
    private ALGQ_Deal_Marketplace_Renderer $renderer;
    private ALGQ_Deal_Marketplace_Security $security;

    public function __construct(ALGQ_Deal_Marketplace_Renderer $renderer, ALGQ_Deal_Marketplace_Security $security)
    {
        $this->renderer = $renderer;
        $this->security = $security;
    }

    public function register_hooks(): void
    {
        if (!is_admin()) {
            return;
        }

        add_action('admin_menu', [$this, 'register_menu']);
        add_action('admin_init', [$this, 'register_settings']);
    }

    public function register_menu(): void
    {
        add_menu_page(
            __('Deal Marketplace', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN),
            __('Deal Marketplace', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN),
            'algq_manage_deal_marketplace',
            'algq-deal-marketplace',
            [$this, 'render_page'],
            'dashicons-store',
            57
        );
    }

    public function register_settings(): void
    {
        register_setting('algq_deal_marketplace', 'algq_deal_marketplace_options', [
            'type' => 'array',
            'sanitize_callback' => [$this, 'sanitize_options'],
            'default' => [],
        ]);
    }

    /**
     * @param mixed $options
     * @return array<string, string>
     */
    public function sanitize_options($options): array
    {
        if (!is_array($options)) {
            return [];
        }

        return [
            'access_mode' => $this->security->sanitize_allowed($options['access_mode'] ?? '', ['private', 'members', 'public'], 'private'),
        ];
    }

    public function render_page(): void
    {
        if (!$this->security->can_manage()) {
            wp_die(esc_html__('You do not have permission to manage the deal marketplace.', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN));
        }

        $this->renderer->render_admin_page();
    }
}
