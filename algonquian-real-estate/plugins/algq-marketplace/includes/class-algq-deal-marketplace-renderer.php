<?php
/**
 * Rendering helpers for Deal Marketplace.
 *
 * @package Algonquian_Deal_Marketplace
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Marketplace_Renderer
{
    private ALGQ_Deal_Marketplace_Repository $repository;
    private ALGQ_Deal_Marketplace_Security $security;

    public function __construct(ALGQ_Deal_Marketplace_Repository $repository, ALGQ_Deal_Marketplace_Security $security)
    {
        $this->repository = $repository;
        $this->security = $security;
    }

    public function render_marketplace(): string
    {
        if (!$this->security->can_view()) {
            return '<p class="algq-marketplace-message">' . esc_html__('Please sign in with an approved buyer or investor account to view marketplace opportunities.', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN) . '</p>';
        }

        $listings = $this->repository->get_active_listings();
        $featured_deals = $this->repository->get_featured_deals();

        ob_start();
        ?>
        <section class="algq-marketplace" aria-labelledby="algq-marketplace-title">
            <h2 id="algq-marketplace-title"><?php echo esc_html__('ARE Deal Marketplace', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></h2>
            <p><?php echo esc_html__('Wholesale deal distribution, investor access, buyer subscriptions, and premium listing controls for the Algonquian Real Estate platform.', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></p>
            <?php if (!empty($featured_deals)) : ?>
                <h3><?php echo esc_html__('Featured deals', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></h3>
                <div class="algq-marketplace-grid algq-marketplace-featured-grid">
                    <?php foreach ($featured_deals as $listing) : ?>
                        <article class="algq-marketplace-card algq-marketplace-card-featured">
                            <h4><?php echo esc_html((string) ($listing['title'] ?? $listing['label'] ?? 'Featured opportunity')); ?></h4>
                            <?php if (!empty($listing['description'])) : ?>
                                <p><?php echo esc_html((string) $listing['description']); ?></p>
                            <?php endif; ?>
                            <?php if (!empty($listing['status'])) : ?>
                                <span><?php echo esc_html((string) $listing['status']); ?></span>
                            <?php endif; ?>
                        </article>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
            <div class="algq-marketplace-grid">
                <?php foreach ($listings as $listing) : ?>
                    <article class="algq-marketplace-card">
                        <h3><?php echo esc_html((string) ($listing['title'] ?? $listing['label'] ?? 'Marketplace opportunity')); ?></h3>
                        <?php if (!empty($listing['description'])) : ?>
                            <p><?php echo esc_html((string) $listing['description']); ?></p>
                        <?php endif; ?>
                        <?php if (!empty($listing['status'])) : ?>
                            <span><?php echo esc_html((string) $listing['status']); ?></span>
                        <?php endif; ?>
                    </article>
                <?php endforeach; ?>
            </div>
        </section>
        <?php
        return (string) ob_get_clean();
    }

    public function render_admin_page(): void
    {
        $listings = $this->repository->get_active_listings();
        $summary_cards = $this->repository->get_admin_summary_cards();
        ?>
        <div class="wrap algq-marketplace-admin">
            <h1><?php echo esc_html__('ARE Deal Marketplace', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></h1>
            <p><?php echo esc_html__('Manage enterprise marketplace readiness, buyer access, NDA acceptance, and buyer interest signals.', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></p>
            <div class="algq-marketplace-summary-cards">
                <?php foreach ($summary_cards as $card) : ?>
                    <div class="algq-marketplace-summary-card">
                        <strong><?php echo esc_html((string) ($card['value'] ?? 0)); ?></strong>
                        <span><?php echo esc_html((string) ($card['label'] ?? 'Metric')); ?></span>
                    </div>
                <?php endforeach; ?>
            </div>
            <h2><?php echo esc_html__('Marketplace modules', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></h2>
            <table class="widefat striped">
                <thead>
                    <tr>
                        <th><?php echo esc_html__('Module', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></th>
                        <th><?php echo esc_html__('Status', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($listings as $listing) : ?>
                        <tr>
                            <td><?php echo esc_html((string) ($listing['title'] ?? $listing['label'] ?? 'Marketplace opportunity')); ?></td>
                            <td><?php echo esc_html((string) ($listing['status'] ?? 'Ready')); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php
    }
}
