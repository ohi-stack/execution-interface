<?php
/**
 * Shortcode registration for Deal Marketplace.
 *
 * @package Algonquian_Deal_Marketplace
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Marketplace_Shortcodes
{
    private ALGQ_Deal_Marketplace_Renderer $renderer;
    private ALGQ_Deal_Marketplace_Assets $assets;

    public function __construct(ALGQ_Deal_Marketplace_Renderer $renderer, ALGQ_Deal_Marketplace_Assets $assets)
    {
        $this->renderer = $renderer;
        $this->assets = $assets;
    }

    public function register(): void
    {
        add_shortcode('algq_marketplace', [$this, 'render_marketplace']);
        add_shortcode('algq_deal_marketplace', [$this, 'render_marketplace']);
    }

    public function render_marketplace(): string
    {
        $this->assets->enqueue_public();
        return $this->renderer->render_marketplace();
    }
}
