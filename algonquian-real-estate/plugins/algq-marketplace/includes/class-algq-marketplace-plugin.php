<?php

declare(strict_types=1);
/**
 * Runtime plugin registration for Algonquian Marketplace.
 *
 * @package AlgqMarketplace
 */

if (!defined('ABSPATH')) {
    exit;
}

class ALGQ_Marketplace_Plugin
{
    private static $instance;

    public static function instance(): self
    {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function init(): void
    {
        (new ALGQ_Marketplace_Shortcodes())->register();
        (new ALGQ_Marketplace_Admin())->register();
        add_action('wp_enqueue_scripts', [$this, 'public_assets']);
        add_action('rest_api_init', [$this, 'rest_routes']);
    }

    public function public_assets(): void
    {
        wp_enqueue_style('algq-marketplace-public', ALGQ_MARKETPLACE_URL . 'assets/css/algq-marketplace-public.css', [], ALGQ_MARKETPLACE_VERSION);
        wp_enqueue_script('algq-marketplace-public', ALGQ_MARKETPLACE_URL . 'assets/js/algq-marketplace-public.js', [], ALGQ_MARKETPLACE_VERSION, true);
        wp_localize_script('algq-marketplace-public', 'ALGQMarketplacePublic', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('algq_marketplace_public_ajax'),
        ]);
    }

    public function rest_routes(): void
    {
        register_rest_route('algq/v1', '/marketplace', [
            'methods' => 'GET',
            'permission_callback' => static function (): bool {
                return current_user_can('view_algq_marketplace') || current_user_can('manage_algq_marketplace');
            },
            'callback' => static function (): WP_REST_Response {
                return new WP_REST_Response([
                    'name' => 'Algonquian Deal Marketplace',
                    'version' => ALGQ_MARKETPLACE_VERSION,
                    'shortcodes' => ['algq_deal_marketplace', 'algq_marketplace_deals', 'algq_marketplace_deal', 'algq_marketplace_nda_gate', 'algq_buyer_dashboard', 'algq_buyer_interest_form'],
                ]);
            },
        ]);
    }
class Algq_Marketplace_Plugin
{
    public function register(): void
    {
        add_shortcode('algq_marketplace', [$this, 'render_shortcode']);
        add_action('rest_api_init', [$this, 'register_rest_routes']);
    }

    public function render_shortcode(): string
    {
        ob_start();
        ?>
        <section class="algq-marketplace" aria-labelledby="algq-marketplace-title">
            <h2 id="algq-marketplace-title">ARE Marketplace</h2>
            <p>Wholesale deal distribution, investor access, buyer subscriptions, and premium listing controls for the Algonquian Real Estate platform.</p>
            <div class="algq-marketplace-grid">
                <?php foreach (self::modules() as $module) : ?>
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
    }

    public function register_rest_routes(): void
    {
        register_rest_route('algq/v1', '/marketplace', [
            'methods' => 'GET',
            'permission_callback' => '__return_true',
            'callback' => function (): WP_REST_Response {
                return new WP_REST_Response([
                    'name' => 'ARE Marketplace',
                    'shortcode' => '[algq_marketplace]',
                    'modules' => self::modules(),
                    'pages' => Algq_Marketplace_Activator::generated_pages(),
                ]);
            },
        ]);
    }

    /**
     * @return array<int, array{label: string, description: string, status: string}>
     */
    public static function modules(): array
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
}
