<?php
/**
 * Plugin Name: Algonquian Product Vault
 * Description: Digital product vault foundation for protected contract packs, calculators, checklists, training assets, license-gated downloads, and WooCommerce product mapping.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 * Requires Plugins: algq-core
 * Text Domain: algq-product-vault
 */

if (!defined('ABSPATH')) {
    exit;
}

function algq_product_vault_core_available(): bool
{
    if (function_exists('algq_core')) {
        return true;
    }

    add_action('admin_notices', static function (): void {
        echo '<div class="notice notice-error"><p>' . esc_html__('Algonquian Product Vault requires the Algonquian Core plugin to be active.', 'algq-product-vault') . '</p></div>';
    });

    return false;
}

add_action('plugins_loaded', static function (): void {
    if (!algq_product_vault_core_available()) {
        return;
    }

    add_shortcode('algq_product_vault', 'algq_product_vault_render_shortcode');
    add_action('rest_api_init', 'algq_product_vault_register_routes');
});

function algq_product_vault_items(): array
{
    return [
        ['label' => 'Contract Packs', 'access' => 'License-gated download'],
        ['label' => 'Spreadsheets', 'access' => 'Buyer and investor tiers'],
        ['label' => 'Calculators', 'access' => 'Subscription-ready'],
        ['label' => 'Checklists', 'access' => 'Training bundle'],
        ['label' => 'Training', 'access' => 'Course and product mapping'],
    ];
}

function algq_product_vault_render_shortcode(): string
{
    ob_start();
    echo '<section class="algq-product-vault"><h2>Product Vault</h2><p>Protected digital products, license-gated downloads, and WooCommerce product mappings.</p><ul>';
    foreach (algq_product_vault_items() as $item) {
        echo '<li><strong>' . esc_html($item['label']) . '</strong><br><span>' . esc_html($item['access']) . '</span></li>';
    }
    echo '</ul></section>';
    return (string) ob_get_clean();
}

function algq_product_vault_register_routes(): void
{
    register_rest_route('algq/v1', '/product-vault', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => static function (): WP_REST_Response {
            return new WP_REST_Response([
                'name' => 'Product Vault',
                'shortcode' => '[algq_product_vault]',
                'items' => algq_product_vault_items(),
            ]);
        },
    ]);
}
