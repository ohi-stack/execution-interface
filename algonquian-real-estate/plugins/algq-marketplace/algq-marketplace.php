<?php
/**
 * Plugin Name: Algonquian Marketplace
 * Description: Marketplace foundations for wholesale deals, investor access, syndication, buyer subscriptions, and premium listings.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Return the marketplace module definitions used by the public shortcode and REST snapshot.
 *
 * @return array<int, array{label: string, description: string, status: string}>
 */
function algq_marketplace_modules(): array
{
    return [
        [
            'label' => 'Wholesale deals',
            'description' => 'Curated off-market assignment opportunities with deal highlights, pricing guidance, and diligence checkpoints.',
            'status' => 'Deal room ready',
        ],
        [
            'label' => 'Investor access',
            'description' => 'Permissioned access tiers for vetted investors, capital partners, and acquisition collaborators.',
            'status' => 'Access gated',
        ],
        [
            'label' => 'Deal syndication',
            'description' => 'Distribution workflows for sending qualified listings to buyer lists, investor circles, and private partner channels.',
            'status' => 'Distribution mapped',
        ],
        [
            'label' => 'Buyer subscriptions',
            'description' => 'Recurring buyer membership tiers for priority deal alerts, downloads, market preferences, and saved buy boxes.',
            'status' => 'Subscription-ready',
        ],
        [
            'label' => 'Premium listings',
            'description' => 'Featured placement for high-value opportunities with enhanced media, underwriting summaries, and urgency indicators.',
            'status' => 'Featured inventory',
        ],
    ];
}

add_shortcode('algq_marketplace', function (): string {
    ob_start();
    ?>
    <section class="algq-marketplace" aria-labelledby="algq-marketplace-title">
        <h2 id="algq-marketplace-title">ARE Marketplace</h2>
        <p>Wholesale deal distribution, investor access, buyer subscriptions, and premium listing controls for the Algonquian Real Estate platform.</p>
        <div class="algq-marketplace-grid">
            <?php foreach (algq_marketplace_modules() as $module) : ?>
                <article class="algq-marketplace-card">
                    <h3><?php echo esc_html($module['label']); ?></h3>
                    <p><?php echo esc_html($module['description']); ?></p>
                    <span><?php echo esc_html($module['status']); ?></span>
                </article>
            <?php endforeach; ?>
        </div>
    </section>
    <?php
    return (string) ob_get_clean();
});

add_action('rest_api_init', function (): void {
    register_rest_route('algq/v1', '/marketplace', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => function (): WP_REST_Response {
            return new WP_REST_Response([
                'name' => 'ARE Marketplace',
                'shortcode' => '[algq_marketplace]',
                'modules' => algq_marketplace_modules(),
            ]);
        },
    ]);
});
