<?php
/**
 * Plugin Name: Algonquian Offer Generator
 * Description: Creative offer, amortization, seller financing, and printable offer summary tools.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 * Text Domain: algq-offer-generator
 */

if (!defined('ABSPATH')) {
    exit;
}

require_once __DIR__ . '/includes/class-algq-offer-engine.php';

add_action('wp_enqueue_scripts', function (): void {
    wp_register_style(
        'algq-offer-generator',
        plugins_url('assets/css/offer-generator.css', __FILE__),
        [],
        '0.1.0'
    );

    wp_register_script(
        'algq-offer-generator',
        plugins_url('assets/js/offer-generator.js', __FILE__),
        [],
        '0.1.0',
        true
    );
});

add_shortcode('algq_offer_generator', function (): string {
    wp_enqueue_style('algq-offer-generator');
    wp_enqueue_script('algq-offer-generator');

    $offer = null;
    $inputs = [
        'property_address' => '',
        'seller_name' => '',
        'buyer_entity' => '',
        'purchase_price' => 0,
        'down_payment' => 0,
        'annual_rate' => 0,
        'term_months' => 60,
        'closing_date' => '',
        'document_type' => 'Letter of Intent',
    ];

    if ('POST' === ($_SERVER['REQUEST_METHOD'] ?? '') && isset($_POST['algq_offer_nonce'])) {
        $nonce = sanitize_text_field(wp_unslash($_POST['algq_offer_nonce']));

        if (wp_verify_nonce($nonce, 'algq_offer_generate')) {
            $inputs = [
                'property_address' => sanitize_text_field(wp_unslash($_POST['property_address'] ?? '')),
                'seller_name' => sanitize_text_field(wp_unslash($_POST['seller_name'] ?? '')),
                'buyer_entity' => sanitize_text_field(wp_unslash($_POST['buyer_entity'] ?? '')),
                'purchase_price' => (float) ($_POST['purchase_price'] ?? 0),
                'down_payment' => (float) ($_POST['down_payment'] ?? 0),
                'annual_rate' => (float) ($_POST['annual_rate'] ?? 0),
                'term_months' => max(1, (int) ($_POST['term_months'] ?? 60)),
                'closing_date' => sanitize_text_field(wp_unslash($_POST['closing_date'] ?? '')),
                'document_type' => sanitize_text_field(wp_unslash($_POST['document_type'] ?? 'Letter of Intent')),
            ];

            $offer = (new ALGQ_Offer_Engine())->generate($inputs);
        }
    }

    ob_start();
    include __DIR__ . '/templates/offer-generator.php';
    return (string) ob_get_clean();
});
