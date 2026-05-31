<?php
/**
 * Plugin Name: Algonquian Digital Products
 * Description: Product library dashboard for contract packs, spreadsheets, calculators, checklists, and training.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 * Requires Plugins: algq-core
 */

if (!defined('ABSPATH')) {
    exit;
}


function algq_digital_products_core_available(): bool
{
    if (function_exists('algq_core')) {
        return true;
    }

    add_action('admin_notices', static function (): void {
        echo '<div class="notice notice-error"><p>' . esc_html__('Algonquian Digital Products requires the Algonquian Core plugin to be active.', 'algq-digital-products') . '</p></div>';
    });

    return false;
}

add_action('plugins_loaded', static function (): void {
    if (!algq_digital_products_core_available()) {
        return;
    }

    add_shortcode('algq_product_library', function (): string {
        $products = ['Contract Packs', 'Spreadsheets', 'Calculators', 'Checklists', 'Training'];
        ob_start();
        echo '<div class="algq-product-library"><h2>Product Library</h2><ul>';
        foreach ($products as $product) {
            echo '<li><strong>' . esc_html($product) . '</strong><br><span>WooCommerce secure download, license tracking, and access-control hooks ready for integration.</span></li>';
        }
        echo '</ul></div>';
        return (string) ob_get_clean();
    });
});
