<?php
/**
 * Shared helpers for Algonquian Deal Marketplace.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

function algq_marketplace_table_name(string $suffix): string
{
    global $wpdb;
    return $wpdb->prefix . 'algq_marketplace_' . preg_replace('/[^a-z0-9_]/', '', strtolower($suffix));
}

function algq_marketplace_default_settings(): array
{
    return [
        'require_login' => 'yes',
        'require_nda' => 'yes',
        'default_deal_visibility' => 'verified_buyers',
        'support_email' => get_option('admin_email'),
        'cleanup_generated_pages' => 'no',
        'cleanup_tables' => 'no',
        'cleanup_options' => 'yes',
    ];
}

function algq_marketplace_get_settings(): array
{
    $settings = get_option(ALGQ_MARKETPLACE_OPTION_SETTINGS, []);
    return wp_parse_args(is_array($settings) ? $settings : [], algq_marketplace_default_settings());
}

function algq_marketplace_sanitize_status(string $status): string
{
    $allowed = ['new', 'reviewing', 'accepted', 'declined', 'archived'];
    return in_array($status, $allowed, true) ? $status : 'new';
}

function algq_marketplace_sanitize_visibility(string $visibility): string
{
    $allowed = ['public', 'logged_in', 'verified_buyers', 'managers', 'private'];
    return in_array($visibility, $allowed, true) ? $visibility : 'verified_buyers';
}

function algq_marketplace_sanitize_access_level(string $level): string
{
    $allowed = ['none', 'buyer', 'verified_buyer', 'manager', 'administrator'];
    return in_array($level, $allowed, true) ? $level : 'none';
}

function algq_marketplace_sanitize_money($amount): string
{
    $normalized = preg_replace('/[^0-9.]/', '', (string) $amount);
    return number_format((float) $normalized, 2, '.', '');
}

function algq_marketplace_sanitize_phone(string $phone): string
{
    return substr(preg_replace('/[^0-9+().\-\s]/', '', $phone), 0, 40);
}

function algq_marketplace_current_user_can_view(): bool
{
    return current_user_can('view_algq_marketplace') || current_user_can('manage_algq_marketplace');
}

function algq_marketplace_user_has_accepted_nda(int $deal_id = 0, int $user_id = 0): bool
{
    if ($user_id <= 0) {
        $user_id = get_current_user_id();
    }

    if ($user_id <= 0) {
        return false;
    }

    global $wpdb;
    $table = algq_marketplace_table_name('nda_acceptances');
    $sql = $deal_id > 0
        ? $wpdb->prepare("SELECT id FROM {$table} WHERE user_id = %d AND deal_id = %d LIMIT 1", $user_id, $deal_id)
        : $wpdb->prepare("SELECT id FROM {$table} WHERE user_id = %d LIMIT 1", $user_id);

    return (bool) $wpdb->get_var($sql);
}

function algq_marketplace_log_activity(string $event, string $message, array $context = []): void
{
    global $wpdb;
    $table = algq_marketplace_table_name('activity_log');

    $wpdb->insert(
        $table,
        [
            'event_type' => sanitize_key($event),
            'message' => sanitize_text_field($message),
            'context' => wp_json_encode(array_map('sanitize_text_field', $context)),
            'user_id' => get_current_user_id(),
            'ip_address' => isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : '',
            'created_at' => current_time('mysql'),
        ],
        ['%s', '%s', '%s', '%d', '%s', '%s']
    );
}

function algq_marketplace_sample_deals(): array
{
    return [
        [
            'id' => 101,
            'title' => 'Institutional SFR Value-Add Package',
            'market' => 'Southeast Growth Corridor',
            'price' => '$1,850,000',
            'visibility' => 'verified_buyers',
            'status' => 'Diligence ready',
        ],
        [
            'id' => 102,
            'title' => 'Urban Infill Multifamily Opportunity',
            'market' => 'Mid-Atlantic Metro',
            'price' => '$3,400,000',
            'visibility' => 'verified_buyers',
            'status' => 'NDA gated',
        ],
    ];
}
