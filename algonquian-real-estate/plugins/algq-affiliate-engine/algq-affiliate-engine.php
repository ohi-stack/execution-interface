<?php
/**
 * Plugin Name: Algonquian Affiliate Engine
 * Description: Affiliate attribution, referral partner tracking, commission readiness, and revenue-system hooks for Algonquian Real Estate offers.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 * Requires Plugins: algq-core
 * Text Domain: algq-affiliate-engine
 */

if (!defined('ABSPATH')) {
    exit;
}

function algq_affiliate_engine_core_available(): bool
{
    if (function_exists('algq_core')) {
        return true;
    }

    add_action('admin_notices', static function (): void {
        echo '<div class="notice notice-error"><p>' . esc_html__('Algonquian Affiliate Engine requires the Algonquian Core plugin to be active.', 'algq-affiliate-engine') . '</p></div>';
    });

    return false;
}

add_action('plugins_loaded', static function (): void {
    if (!algq_affiliate_engine_core_available()) {
        return;
    }

    add_shortcode('algq_affiliate_engine', 'algq_affiliate_engine_render_shortcode');
    add_action('rest_api_init', 'algq_affiliate_engine_register_routes');
});

function algq_affiliate_engine_channels(): array
{
    return [
        ['label' => 'Referral links', 'status' => 'Attribution-ready'],
        ['label' => 'Partner profiles', 'status' => 'CRM-ready'],
        ['label' => 'Commission events', 'status' => 'Revenue-system hook'],
        ['label' => 'Payout exports', 'status' => 'Accounting-ready'],
    ];
}

function algq_affiliate_engine_render_shortcode(): string
{
    ob_start();
    echo '<section class="algq-affiliate-engine"><h2>Affiliate Engine</h2><p>Referral partner tracking and commission workflows for platform revenue channels.</p><ul>';
    foreach (algq_affiliate_engine_channels() as $channel) {
        echo '<li><strong>' . esc_html($channel['label']) . '</strong><br><span>' . esc_html($channel['status']) . '</span></li>';
    }
    echo '</ul></section>';
    return (string) ob_get_clean();
}

function algq_affiliate_engine_register_routes(): void
{
    register_rest_route('algq/v1', '/affiliate-engine', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => static function (): WP_REST_Response {
            return new WP_REST_Response([
                'name' => 'Affiliate Engine',
                'shortcode' => '[algq_affiliate_engine]',
                'channels' => algq_affiliate_engine_channels(),
            ]);
        },
    ]);
}
