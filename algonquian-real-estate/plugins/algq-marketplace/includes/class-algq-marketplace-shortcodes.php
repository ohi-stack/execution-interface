<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

class ALGQ_Marketplace_Shortcodes
{
    public function register(): void
    {
        add_shortcode('algq_deal_marketplace', [$this, 'marketplace']);
        add_shortcode('algq_marketplace_deals', [$this, 'deals']);
        add_shortcode('algq_marketplace_deal', [$this, 'deal']);
        add_shortcode('algq_marketplace_nda_gate', [$this, 'nda_gate']);
        add_shortcode('algq_buyer_dashboard', [$this, 'buyer_dashboard']);
        add_shortcode('algq_buyer_interest_form', [$this, 'interest_form']);
        add_shortcode('algq_marketplace', [$this, 'marketplace']);
    }

    public function marketplace($atts = []): string
    {
        $atts = shortcode_atts(['view' => 'overview'], $this->sanitize_atts((array) $atts), 'algq_deal_marketplace');
        return $this->buffer(function () use ($atts): void {
            if (!$this->passes_access()) {
                return;
            }
            ?>
            <section class="algq-marketplace-public algq-marketplace-hero">
                <p class="algq-kicker"><?php echo esc_html__('Algonquian Real Estate', 'algq-marketplace'); ?></p>
                <h2><?php echo esc_html__('Deal Marketplace', 'algq-marketplace'); ?></h2>
                <p><?php echo esc_html__('Permissioned institutional deal access, NDA-gated diligence, and buyer interest workflows.', 'algq-marketplace'); ?></p>
                <?php if ($atts['view'] === 'documentation') : ?>
                    <div class="algq-notice"><?php echo esc_html__('Start by reviewing deals, accepting the NDA gate, then submitting buyer interest with verified contact details.', 'algq-marketplace'); ?></div>
                <?php endif; ?>
            </section>
            <?php echo $this->deals(['limit' => 2]); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
            <?php
        });
    }

    public function deals($atts = []): string
    {
        $atts = shortcode_atts(['limit' => 12, 'visibility' => 'verified_buyers'], $this->sanitize_atts((array) $atts), 'algq_marketplace_deals');
        $limit = min(50, max(1, absint($atts['limit'])));
        $visibility = algq_marketplace_sanitize_visibility((string) $atts['visibility']);

        return $this->buffer(function () use ($limit, $visibility): void {
            if (!$this->passes_access()) {
                return;
            }

            $deals = array_slice(algq_marketplace_sample_deals(), 0, $limit);
            ?>
            <div class="algq-marketplace-grid" data-visibility="<?php echo esc_attr($visibility); ?>">
                <?php foreach ($deals as $deal) : ?>
                    <article class="algq-marketplace-card">
                        <span class="algq-status"><?php echo esc_html($deal['status']); ?></span>
                        <h3><?php echo esc_html($deal['title']); ?></h3>
                        <p><?php echo esc_html($deal['market']); ?></p>
                        <strong><?php echo esc_html($deal['price']); ?></strong>
                        <a class="algq-button" href="<?php echo esc_url(add_query_arg('deal_id', absint($deal['id']), home_url('/submit-interest/'))); ?>"><?php echo esc_html__('Submit Interest', 'algq-marketplace'); ?></a>
                    </article>
                <?php endforeach; ?>
            </div>
            <?php
        });
    }

    public function deal($atts = []): string
    {
        $atts = shortcode_atts(['id' => 0], $this->sanitize_atts((array) $atts), 'algq_marketplace_deal');
        $deal_id = absint($atts['id'] ?: wp_unslash($_GET['deal_id'] ?? 0)); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

        return $this->buffer(function () use ($deal_id): void {
            if (!$this->passes_access()) {
                return;
            }
            $deal = algq_marketplace_sample_deals()[0];
            ?>
            <section class="algq-marketplace-card algq-marketplace-detail">
                <h2><?php echo esc_html($deal_id > 0 ? sprintf(__('Deal #%d', 'algq-marketplace'), $deal_id) : $deal['title']); ?></h2>
                <p><?php echo esc_html__('Detailed diligence materials are released after NDA acceptance and manager approval.', 'algq-marketplace'); ?></p>
                <?php echo $this->nda_gate(['deal_id' => $deal_id]); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
            </section>
            <?php
        });
    }

    public function nda_gate($atts = []): string
    {
        $atts = shortcode_atts(['deal_id' => 0], $this->sanitize_atts((array) $atts), 'algq_marketplace_nda_gate');
        $deal_id = absint($atts['deal_id'] ?: wp_unslash($_GET['deal_id'] ?? 0)); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

        if (sanitize_text_field(wp_unslash($_SERVER['REQUEST_METHOD'] ?? '')) === 'POST' && isset($_POST['algq_nda_nonce'])) {
            $this->handle_nda($deal_id);
        }

        return $this->buffer(function () use ($deal_id): void {
            if (!$this->passes_login()) {
                return;
            }

            if (algq_marketplace_user_has_accepted_nda($deal_id)) {
                echo '<div class="algq-notice">' . esc_html__('NDA accepted. Marketplace access is enabled for approved deal materials.', 'algq-marketplace') . '</div>';
                return;
            }
            ?>
            <form class="algq-marketplace-form" method="post">
                <h3><?php echo esc_html__('NDA Acceptance', 'algq-marketplace'); ?></h3>
                <?php wp_nonce_field('algq_accept_nda', 'algq_nda_nonce'); ?>
                <input type="hidden" name="deal_id" value="<?php echo esc_attr((string) $deal_id); ?>">
                <label><?php echo esc_html__('Signer name', 'algq-marketplace'); ?><input required name="signer_name" type="text"></label>
                <label><?php echo esc_html__('Signer email', 'algq-marketplace'); ?><input required name="signer_email" type="email"></label>
                <button class="algq-button" type="submit" name="algq_accept_nda" value="1"><?php echo esc_html__('Accept NDA', 'algq-marketplace'); ?></button>
            </form>
            <?php
        });
    }

    public function buyer_dashboard($atts = []): string
    {
        $this->sanitize_atts((array) $atts);
        return $this->buffer(function (): void {
            if (!$this->passes_access()) {
                return;
            }
            ?>
            <section class="algq-marketplace-dashboard">
                <h2><?php echo esc_html__('Buyer Dashboard', 'algq-marketplace'); ?></h2>
                <ul>
                    <li><?php echo esc_html__('Access level: Verified buyer', 'algq-marketplace'); ?></li>
                    <li><?php echo esc_html__('Next step: accept NDA for each gated deal package.', 'algq-marketplace'); ?></li>
                    <li><?php echo esc_html__('Use Submit Interest to route offers to the marketplace team.', 'algq-marketplace'); ?></li>
                </ul>
            </section>
            <?php
        });
    }

    public function interest_form($atts = []): string
    {
        $atts = shortcode_atts(['deal_id' => 0], $this->sanitize_atts((array) $atts), 'algq_buyer_interest_form');
        $deal_id = absint($atts['deal_id'] ?: wp_unslash($_GET['deal_id'] ?? 0)); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

        if (sanitize_text_field(wp_unslash($_SERVER['REQUEST_METHOD'] ?? '')) === 'POST' && isset($_POST['algq_interest_nonce'])) {
            $this->handle_interest($deal_id);
        }

        return $this->buffer(function () use ($deal_id): void {
            if (!$this->passes_access('submit_algq_buyer_interest')) {
                return;
            }
            ?>
            <form class="algq-marketplace-form" method="post">
                <h3><?php echo esc_html__('Submit Buyer Interest', 'algq-marketplace'); ?></h3>
                <?php wp_nonce_field('algq_submit_interest', 'algq_interest_nonce'); ?>
                <input type="hidden" name="deal_id" value="<?php echo esc_attr((string) $deal_id); ?>">
                <label><?php echo esc_html__('Name', 'algq-marketplace'); ?><input required name="buyer_name" type="text"></label>
                <label><?php echo esc_html__('Email', 'algq-marketplace'); ?><input required name="buyer_email" type="email"></label>
                <label><?php echo esc_html__('Phone', 'algq-marketplace'); ?><input name="buyer_phone" type="tel"></label>
                <label><?php echo esc_html__('Offer amount', 'algq-marketplace'); ?><input name="offer_amount" type="text" inputmode="decimal"></label>
                <label><?php echo esc_html__('Notes', 'algq-marketplace'); ?><textarea name="notes"></textarea></label>
                <button class="algq-button" type="submit" name="algq_submit_interest" value="1"><?php echo esc_html__('Submit Interest', 'algq-marketplace'); ?></button>
            </form>
            <?php
        });
    }

    private function handle_nda(int $deal_id): void
    {
        if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['algq_nda_nonce'] ?? '')), 'algq_accept_nda')) {
            return;
        }

        global $wpdb;
        $wpdb->insert(algq_marketplace_table_name('nda_acceptances'), [
            'deal_id' => absint(wp_unslash($_POST['deal_id'] ?? $deal_id)),
            'user_id' => get_current_user_id(),
            'signer_name' => sanitize_text_field(wp_unslash($_POST['signer_name'] ?? '')),
            'signer_email' => sanitize_email(wp_unslash($_POST['signer_email'] ?? '')),
            'accepted_version' => ALGQ_MARKETPLACE_VERSION,
            'ip_address' => sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'] ?? '')),
            'user_agent' => sanitize_text_field(wp_unslash($_SERVER['HTTP_USER_AGENT'] ?? '')),
            'accepted_at' => current_time('mysql'),
        ], ['%d', '%d', '%s', '%s', '%s', '%s', '%s', '%s']);
        algq_marketplace_log_activity('nda_acceptance', __('NDA accepted.', 'algq-marketplace'), ['deal_id' => (string) $deal_id]);
    }

    private function handle_interest(int $deal_id): void
    {
        if (!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['algq_interest_nonce'] ?? '')), 'algq_submit_interest')) {
            return;
        }

        if (!current_user_can('submit_algq_buyer_interest') && !current_user_can('manage_algq_marketplace')) {
            return;
        }

        global $wpdb;
        $wpdb->insert(algq_marketplace_table_name('buyer_offers'), [
            'deal_id' => absint(wp_unslash($_POST['deal_id'] ?? $deal_id)),
            'user_id' => get_current_user_id(),
            'buyer_name' => sanitize_text_field(wp_unslash($_POST['buyer_name'] ?? '')),
            'buyer_email' => sanitize_email(wp_unslash($_POST['buyer_email'] ?? '')),
            'buyer_phone' => algq_marketplace_sanitize_phone(wp_unslash($_POST['buyer_phone'] ?? '')),
            'offer_amount' => algq_marketplace_sanitize_money(wp_unslash($_POST['offer_amount'] ?? '')),
            'notes' => sanitize_textarea_field(wp_unslash($_POST['notes'] ?? '')),
            'status' => 'new',
            'created_at' => current_time('mysql'),
        ], ['%d', '%d', '%s', '%s', '%s', '%f', '%s', '%s', '%s']);
        algq_marketplace_log_activity('buyer_interest', __('Buyer interest submitted.', 'algq-marketplace'), ['deal_id' => (string) $deal_id]);
    }

    private function passes_login(): bool
    {
        if (is_user_logged_in()) {
            return true;
        }

        echo '<div class="algq-notice">' . esc_html__('Please log in to access the marketplace.', 'algq-marketplace') . '</div>';
        return false;
    }

    private function passes_access(string $capability = 'view_algq_marketplace'): bool
    {
        if (!$this->passes_login()) {
            return false;
        }

        if (current_user_can($capability) || current_user_can('manage_algq_marketplace')) {
            return true;
        }

        echo '<div class="algq-notice">' . esc_html__('Your account does not have marketplace access.', 'algq-marketplace') . '</div>';
        return false;
    }

    private function sanitize_atts(array $atts): array
    {
        $sanitized = [];
        foreach ($atts as $key => $value) {
            $sanitized[sanitize_key((string) $key)] = is_scalar($value) ? sanitize_text_field((string) $value) : '';
        }
        return $sanitized;
    }

    private function buffer(callable $callback): string
    {
        ob_start();
        $callback();
        return (string) ob_get_clean();
    }
}
