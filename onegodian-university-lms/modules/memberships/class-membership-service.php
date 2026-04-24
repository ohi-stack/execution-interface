<?php

if (! defined('ABSPATH')) {
    exit;
}

class OG_LMS_Membership_Service
{
    private const ACTIVE_STATUSES = ['active', 'trialing'];

    public static function get_required_tier_for_course(int $course_id): string
    {
        $tier = (string) get_post_meta($course_id, '_og_required_tier', true);
        return sanitize_key($tier);
    }

    public static function can_access_course(int $user_id, int $course_id): bool
    {
        if ($user_id <= 0 || $course_id <= 0) {
            return false;
        }

        $required_tier = self::get_required_tier_for_course($course_id);
        if ($required_tier === '') {
            return true;
        }

        $membership = self::get_active_membership($user_id);
        if (! $membership) {
            return false;
        }

        return self::tier_allows($membership['tier'], $required_tier);
    }

    public static function get_active_membership(int $user_id): ?array
    {
        global $wpdb;
        $table = $wpdb->prefix . 'og_memberships';
        $sql = $wpdb->prepare(
            "SELECT tier, status, renews_at, stripe_subscription_id
            FROM {$table}
            WHERE user_id = %d
            ORDER BY updated_at DESC
            LIMIT 1",
            $user_id
        );

        $row = $wpdb->get_row($sql, ARRAY_A);
        if (! is_array($row) || empty($row)) {
            return null;
        }

        $row['tier'] = sanitize_key((string) ($row['tier'] ?? ''));
        $row['status'] = sanitize_key((string) ($row['status'] ?? ''));
        $row['renews_at'] = (string) ($row['renews_at'] ?? '');
        $row['stripe_subscription_id'] = sanitize_text_field((string) ($row['stripe_subscription_id'] ?? ''));

        if (! in_array($row['status'], self::ACTIVE_STATUSES, true)) {
            return null;
        }

        return $row;
    }

    public static function tier_allows(string $member_tier, string $required_tier): bool
    {
        $weights = [
            'starter' => 10,
            'pro' => 20,
            'university' => 30,
        ];

        $member = $weights[sanitize_key($member_tier)] ?? 0;
        $required = $weights[sanitize_key($required_tier)] ?? 999;

        return $member >= $required;
    }

    public static function upsert_from_stripe_event(array $payload): void
    {
        global $wpdb;

        $data = isset($payload['data']['object']) && is_array($payload['data']['object'])
            ? $payload['data']['object']
            : [];

        $customer_id = sanitize_text_field((string) ($data['customer'] ?? ''));
        $subscription_id = sanitize_text_field((string) ($data['id'] ?? ''));
        $status = sanitize_key((string) ($data['status'] ?? 'inactive'));

        if ($customer_id === '' || $subscription_id === '') {
            return;
        }

        $user_id = (int) $wpdb->get_var(
            $wpdb->prepare(
                "SELECT user_id FROM {$wpdb->prefix}og_memberships WHERE stripe_customer_id = %s LIMIT 1",
                $customer_id
            )
        );

        if ($user_id <= 0) {
            return;
        }

        $tier = sanitize_key((string) get_user_meta($user_id, 'og_lms_pending_tier', true));
        if ($tier === '') {
            $tier = 'starter';
        }

        $renews_at_ts = (int) ($data['current_period_end'] ?? 0);
        $renews_at = $renews_at_ts > 0 ? gmdate('Y-m-d H:i:s', $renews_at_ts) : null;

        $table = $wpdb->prefix . 'og_memberships';
        $existing_id = (int) $wpdb->get_var(
            $wpdb->prepare(
                "SELECT id FROM {$table} WHERE user_id = %d LIMIT 1",
                $user_id
            )
        );

        $record = [
            'user_id' => $user_id,
            'tier' => $tier,
            'status' => $status,
            'stripe_customer_id' => $customer_id,
            'stripe_subscription_id' => $subscription_id,
            'renews_at' => $renews_at,
            'updated_at' => OG_LMS_Helpers::now(),
        ];

        if ($existing_id > 0) {
            $wpdb->update(
                $table,
                $record,
                ['id' => $existing_id],
                ['%d', '%s', '%s', '%s', '%s', '%s', '%s'],
                ['%d']
            );
        } else {
            $record['created_at'] = OG_LMS_Helpers::now();
            $wpdb->insert(
                $table,
                $record,
                ['%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s']
            );
        }

        OG_LMS_Emails::send_onboarding_once($user_id, $tier);
    }
}
