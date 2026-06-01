<?php
/**
 * Buyer interest and offer capture for Deal Marketplace.
 *
 * @package Algonquian_Deal_Marketplace
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Marketplace_Interest
{
    private ALGQ_Deal_Marketplace_Repository $repository;
    private ALGQ_Deal_Marketplace_Security $security;
    private ALGQ_Deal_Marketplace_Audit_Log $audit_log;

    public function __construct(ALGQ_Deal_Marketplace_Repository $repository, ALGQ_Deal_Marketplace_Security $security, ALGQ_Deal_Marketplace_Audit_Log $audit_log)
    {
        $this->repository = $repository;
        $this->security = $security;
        $this->audit_log = $audit_log;
    }

    public function register_hooks(): void
    {
        add_action('admin_post_algq_deal_marketplace_interest', [$this, 'handle_submission']);
        add_action('admin_post_nopriv_algq_deal_marketplace_interest', [$this, 'handle_submission']);
    }

    public function handle_submission(): void
    {
        $nonce = isset($_POST[ALGQ_Deal_Marketplace_Security::NONCE_NAME]) ? (string) $_POST[ALGQ_Deal_Marketplace_Security::NONCE_NAME] : '';

        if (!$this->security->verify_nonce($nonce) || !$this->security->can_submit_interest()) {
            wp_die(esc_html__('Unable to submit marketplace interest.', ALGQ_DEAL_MARKETPLACE_TEXT_DOMAIN), '', ['response' => 403]);
        }

        $interest_id = $this->repository->insert_interest([
            'listing_id' => absint($_POST['listing_id'] ?? 0),
            'buyer_name' => $this->security->sanitize_text(isset($_POST['buyer_name']) ? (string) $_POST['buyer_name'] : ''),
            'buyer_email' => $this->security->sanitize_email(isset($_POST['buyer_email']) ? (string) $_POST['buyer_email'] : ''),
            'offer_amount' => isset($_POST['offer_amount']) ? (float) $_POST['offer_amount'] : null,
            'message' => $this->security->sanitize_text(isset($_POST['message']) ? (string) $_POST['message'] : ''),
        ]);

        $this->audit_log->record('interest_submitted', 'interest', $interest_id);
        wp_safe_redirect(wp_get_referer() ?: home_url('/'));
        exit;
    }
}
