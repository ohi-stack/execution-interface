<?php
/**
 * Security helpers for Deal Marketplace.
 *
 * @package Algonquian_Deal_Marketplace
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Marketplace_Security
{
    public const NONCE_ACTION = 'algq_deal_marketplace_action';
    public const NONCE_NAME = 'algq_deal_marketplace_nonce';

    public function verify_nonce(?string $nonce): bool
    {
        return is_string($nonce) && wp_verify_nonce($nonce, self::NONCE_ACTION) !== false;
    }

    public function sanitize_text(?string $value): string
    {
        return sanitize_text_field(wp_unslash((string) $value));
    }

    public function sanitize_email(?string $value): string
    {
        return sanitize_email(wp_unslash((string) $value));
    }

    /**
     * @param array<string> $allowed
     */
    public function sanitize_allowed(?string $value, array $allowed, string $default = ''): string
    {
        $value = $this->sanitize_text($value);
        return in_array($value, $allowed, true) ? $value : $default;
    }

    public function can_manage(): bool
    {
        return current_user_can('algq_manage_deal_marketplace') || current_user_can('manage_options');
    }

    public function can_view(): bool
    {
        return current_user_can('algq_view_deal_marketplace') || current_user_can('algq_manage_deal_marketplace') || current_user_can('manage_options');
    }

    public function can_submit_interest(): bool
    {
        return current_user_can('algq_submit_deal_interest') || current_user_can('algq_manage_deal_marketplace') || current_user_can('manage_options');
    }
}
