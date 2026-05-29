<?php
/**
 * Plugin Name: Algonquian Offer Generator
 * Description: Creative offer, amortization, legacy visualization, and printable offer summary tools.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 */

if (!defined('ABSPATH')) {
    exit;
}

require_once __DIR__ . '/includes/class-amortization-engine.php';

add_action('wp_enqueue_scripts', function (): void {
    wp_register_style('algq-offer-generator', plugins_url('assets/css/offer-generator.css', __FILE__), [], '0.1.0');
    wp_register_script('algq-offer-generator', plugins_url('assets/js/offer-generator.js', __FILE__), [], '0.1.0', true);
});

add_shortcode('algq_offer_generator', function (): string {
    wp_enqueue_style('algq-offer-generator');
    wp_enqueue_script('algq-offer-generator');
    $offer = null;
    if ('POST' === ($_SERVER['REQUEST_METHOD'] ?? '') && isset($_POST['algq_offer_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['algq_offer_nonce'])), 'algq_offer_generate')) {
        $engine = new ALGQ_Amortization_Engine();
        $offer = $engine->schedule((float) ($_POST['price'] ?? 0), (float) ($_POST['rate'] ?? 0), (int) ($_POST['term'] ?? 1));
    }
    ob_start();
    include __DIR__ . '/templates/app.php';
    return (string) ob_get_clean();
});
