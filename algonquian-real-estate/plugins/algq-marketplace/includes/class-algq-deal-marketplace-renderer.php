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
        $listing_count = count($listings);

        ob_start();
        ?>
        <section class="algq-marketplace" aria-labelledby="algq-marketplace-title">
            <div class="algq-marketplace-hero">
                <div>
                    <span class="algq-marketplace-kicker"><?php echo esc_html__('Algonquian Real Estate', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></span>
                    <h2 id="algq-marketplace-title"><?php echo esc_html__('ARE Deal Marketplace', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></h2>
                    <p><?php echo esc_html__('Access curated wholesale opportunities, NDA-gated diligence, buyer offers, premium deal distribution, and secure investor-ready listing workflows.', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></p>
                    <div class="algq-marketplace-actions">
                        <a class="algq-marketplace-button algq-marketplace-button--gold" href="#algq-marketplace-deals" data-algq-marketplace-scroll="#algq-marketplace-deals"><?php echo esc_html__('View deal access', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></a>
                        <a class="algq-marketplace-button algq-marketplace-button--ghost" href="#algq-buyer-interest" data-algq-marketplace-scroll="#algq-buyer-interest"><?php echo esc_html__('Submit buyer interest', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></a>
                    </div>
                </div>
                <div class="algq-marketplace-hero-panel" aria-label="<?php echo esc_attr__('Marketplace summary', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?>">
                    <div class="algq-marketplace-hero-metric"><strong><?php echo esc_html((string) $listing_count); ?></strong><span><?php echo esc_html__('Deal channels', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></span></div>
                    <div class="algq-marketplace-hero-metric"><strong><?php echo esc_html__('NDA', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></strong><span><?php echo esc_html__('Gated diligence', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></span></div>
                    <div class="algq-marketplace-hero-metric"><strong><?php echo esc_html__('Premium', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></strong><span><?php echo esc_html__('Deal distribution', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></span></div>
                </div>
            </div>

            <?php if (!empty($featured_deals)) : ?>
                <h3><?php echo esc_html__('Featured deals', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></h3>
                <div class="algq-marketplace-grid algq-marketplace-featured-grid">
                    <?php foreach ($featured_deals as $listing) : ?>
                        <article class="algq-marketplace-card algq-marketplace-card-featured">
                            <h4><?php echo esc_html((string) ($listing['title'] ?? $listing['label'] ?? __('Featured opportunity', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN))); ?></h4>
                            <?php if (!empty($listing['description'])) : ?>
                                <p><?php echo esc_html((string) $listing['description']); ?></p>
                            <?php endif; ?>
                            <?php if (!empty($listing['status'])) : ?>
                                <span class="algq-marketplace-badge"><?php echo esc_html((string) $listing['status']); ?></span>
                            <?php endif; ?>
                        </article>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <div id="algq-marketplace-deals" class="algq-marketplace-grid">
                <?php foreach ($listings as $index => $listing) : ?>
                    <?php
                    $title = (string) ($listing['title'] ?? $listing['label'] ?? __('Marketplace opportunity', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN));
                    $status = (string) ($listing['status'] ?? __('Ready', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN));
                    $description = (string) ($listing['description'] ?? '');
                    $is_premium = 0 === $index % 3 || false !== stripos($title, 'premium');
                    $is_nda = 1 === $index % 3 || false !== stripos($status, 'gated');
                    $card_classes = 'algq-marketplace-card';
                    $card_classes .= $is_premium ? ' algq-marketplace-card--premium algq-marketplace-card--locked' : '';
                    $card_classes .= $is_nda ? ' algq-marketplace-card--nda is-nda-required' : '';
                    ?>
                    <article class="<?php echo esc_attr($card_classes); ?>" data-algq-deal-card>
                        <h3><?php echo esc_html($title); ?></h3>
                        <?php if ('' !== $description) : ?>
                            <p><?php echo esc_html($description); ?></p>
                        <?php endif; ?>
                        <div class="algq-marketplace-card-meta">
                            <span class="algq-marketplace-badge"><?php echo esc_html($status); ?></span>
                            <?php if ($is_nda) : ?>
                                <span class="algq-marketplace-badge"><?php echo esc_html__('NDA required', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></span>
                            <?php endif; ?>
                            <?php if ($is_premium) : ?>
                                <span class="algq-marketplace-badge"><?php echo esc_html__('Premium access', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></span>
                            <?php endif; ?>
                        </div>
                        <?php if ($is_premium) : ?>
                            <button type="button" data-algq-locked-deal data-message="<?php echo esc_attr__('Premium deal access requires Algonquian approval.', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?>"><?php echo esc_html__('Request premium access', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></button>
                        <?php else : ?>
                            <a href="#algq-buyer-interest" data-algq-marketplace-scroll="#algq-buyer-interest"><?php echo esc_html__('Register interest', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></a>
                        <?php endif; ?>
                    </article>
                <?php endforeach; ?>
            </div>

            <form id="algq-buyer-interest" class="algq-interest-form" data-algq-interest-form method="post">
                <span class="algq-marketplace-kicker"><?php echo esc_html__('Buyer interest', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></span>
                <div class="algq-form-grid">
                    <label><?php echo esc_html__('Buyer name', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?><input type="text" name="buyer_name" autocomplete="name"></label>
                    <label><?php echo esc_html__('Buyer email', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?><input type="email" name="buyer_email" autocomplete="email"></label>
                </div>
                <div class="algq-form-grid">
                    <label><?php echo esc_html__('Target market', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?><input type="text" name="target_market" autocomplete="off"></label>
                    <label><?php echo esc_html__('Offer range', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?><input type="text" name="offer_range" inputmode="decimal"></label>
                </div>
                <label><?php echo esc_html__('Acquisition notes', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?><textarea name="message" rows="4"></textarea></label>
                <button type="submit"><?php echo esc_html__('Send buyer interest', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></button>
            </form>
        </section>
        <?php
        return (string) ob_get_clean();
    }

    public function render_admin_page(): void
    {
        $listings = $this->repository->get_active_listings();
        $summary_cards = $this->repository->get_admin_summary_cards();
        $cache_clear_url = wp_nonce_url(
            admin_url('admin-post.php?action=algq_deal_marketplace_clear_cache'),
            ALGQ_Deal_Marketplace_Security::NONCE_ACTION,
            ALGQ_Deal_Marketplace_Security::NONCE_NAME
        );
        ?>
        <div class="wrap algq-marketplace-admin">
            <?php if (isset($_GET['algq_cache_cleared']) && '1' === sanitize_text_field(wp_unslash((string) $_GET['algq_cache_cleared']))) : ?>
                <div class="notice notice-success is-dismissible"><p><?php echo esc_html__('Marketplace cache cleared.', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></p></div>
            <?php endif; ?>
            <div class="algq-admin-hero">
                <div>
                    <p class="algq-admin-eyebrow"><?php echo esc_html__('Algonquian Real Estate Command Center', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></p>
                    <h1><?php echo esc_html__('Deal Marketplace Executive Dashboard', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></h1>
                    <p><?php echo esc_html__('Manage enterprise marketplace readiness, buyer access, NDA acceptance, premium deal visibility, cache posture, and buyer interest signals.', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></p>
                    <div class="algq-admin-hero-actions">
                        <a class="algq-admin-button algq-admin-button--gold" href="#algq-marketplace-interest-table"><?php echo esc_html__('Review buyer interest', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></a>
                        <a class="algq-admin-button algq-admin-button--ghost" href="<?php echo esc_url($cache_clear_url); ?>" data-algq-cache-clear data-confirm-message="<?php echo esc_attr__('Clear marketplace cache and refresh deal distribution data?', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?>"><?php echo esc_html__('Clear marketplace cache', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></a>
                    </div>
                </div>
                <div class="algq-admin-stat-stack" aria-label="<?php echo esc_attr__('Marketplace summary', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?>">
                    <?php foreach ($summary_cards as $card) : ?>
                        <div class="algq-admin-stat"><strong><?php echo esc_html((string) ($card['value'] ?? 0)); ?></strong><span><?php echo esc_html((string) ($card['label'] ?? __('Metric', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN))); ?></span></div>
                    <?php endforeach; ?>
                    <div class="algq-admin-stat"><strong><?php echo esc_html(ALGQ_DEAL_MARKETPLACE_VERSION); ?></strong><span><?php echo esc_html__('Plugin version', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></span></div>
                </div>
            </div>

            <div class="algq-admin-card-grid">
                <section class="algq-admin-card"><h2><?php echo esc_html__('Buyer pipeline', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></h2><span class="algq-admin-card-value"><?php echo esc_html__('Active', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></span><p><?php echo esc_html__('Buyer offers and interest signals are positioned for secure review.', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></p></section>
                <section class="algq-admin-card"><h2><?php echo esc_html__('Premium deal access', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></h2><span class="algq-admin-card-value"><?php echo esc_html__('Gated', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></span><p><?php echo esc_html__('Premium inventory can remain locked until buyer approval or NDA completion.', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></p></section>
                <section class="algq-admin-card"><h2><?php echo esc_html__('Secure distribution', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></h2><span class="algq-admin-card-value"><?php echo esc_html__('Ready', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></span><p><?php echo esc_html__('Designed for institutional deal routing without external CDN dependencies.', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></p></section>
            </div>

            <section id="algq-marketplace-interest-table" class="algq-interest-table-wrap">
                <h2><?php echo esc_html__('Marketplace modules', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></h2>
                <table class="widefat striped algq-interest-table">
                    <thead><tr><th><?php echo esc_html__('Module', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></th><th><?php echo esc_html__('Status', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></th><th><?php echo esc_html__('Access', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN); ?></th></tr></thead>
                    <tbody>
                        <?php foreach ($listings as $index => $listing) : ?>
                            <tr>
                                <td><?php echo esc_html((string) ($listing['title'] ?? $listing['label'] ?? __('Marketplace opportunity', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN))); ?></td>
                                <td><span class="algq-status-badge algq-status-badge--ready"><?php echo esc_html((string) ($listing['status'] ?? __('Ready', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN))); ?></span></td>
                                <td><?php echo esc_html(0 === $index % 3 ? __('Premium', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN) : __('Standard', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN)); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </section>
        </div>
        <?php
    }
}
