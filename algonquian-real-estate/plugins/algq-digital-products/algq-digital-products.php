<?php
/**
 * Plugin Name: Algonquian Digital Products
 * Description: Product library dashboard for contract packs, spreadsheets, calculators, checklists, and training.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 */

if (!defined('ABSPATH')) {
    exit;
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
