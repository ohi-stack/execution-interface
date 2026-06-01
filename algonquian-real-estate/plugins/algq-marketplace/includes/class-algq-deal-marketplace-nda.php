<?php
/**
 * NDA acceptance service for Deal Marketplace.
 *
 * @package Algonquian_Deal_Marketplace
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Marketplace_NDA
{
    private ALGQ_Deal_Marketplace_Repository $repository;
    private ALGQ_Deal_Marketplace_Audit_Log $audit_log;

    public function __construct(ALGQ_Deal_Marketplace_Repository $repository, ALGQ_Deal_Marketplace_Audit_Log $audit_log)
    {
        $this->repository = $repository;
        $this->audit_log = $audit_log;
    }

    public function accept(int $listing_id, int $user_id): void
    {
        $ip = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash((string) $_SERVER['REMOTE_ADDR'])) : '';
        $ip_hash = $ip ? wp_hash($ip) : '';

        $this->repository->record_nda_acceptance($listing_id, $user_id, $ip_hash);
        $this->audit_log->record('nda_accepted', 'listing', $listing_id, ['user_id' => $user_id]);
    }
}
