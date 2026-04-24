<?php

if (! defined('ABSPATH')) {
    exit;
}

class OG_LMS_Stripe_Gateway
{
    private const SUPPORTED_EVENTS = [
        'checkout.session.completed',
        'invoice.paid',
        'invoice.payment_failed',
        'customer.subscription.updated',
        'customer.subscription.deleted',
    ];

    public static function bootstrap(): void
    {
        add_action('rest_api_init', [self::class, 'register_routes']);
    }

    public static function register_routes(): void
    {
        register_rest_route('og-lms/v1', '/stripe/webhook', [
            'methods' => 'POST',
            'callback' => [self::class, 'handle_webhook'],
            'permission_callback' => '__return_true',
        ]);
    }

    public static function handle_webhook(WP_REST_Request $request): WP_REST_Response
    {
        $raw_body = (string) $request->get_body();
        $signature = (string) $request->get_header('stripe-signature');

        if (! self::verify_signature($raw_body, $signature)) {
            return new WP_REST_Response(['message' => 'Invalid signature'], 400);
        }

        $payload = json_decode($raw_body, true);
        if (! is_array($payload)) {
            return new WP_REST_Response(['message' => 'Invalid payload'], 400);
        }

        $event_type = sanitize_text_field((string) ($payload['type'] ?? ''));
        if (! in_array($event_type, self::SUPPORTED_EVENTS, true)) {
            return new WP_REST_Response(['received' => true, 'ignored' => true], 200);
        }

        self::process_event($payload);

        return new WP_REST_Response([
            'received' => true,
            'event_type' => $event_type,
        ]);
    }

    private static function process_event(array $payload): void
    {
        $type = sanitize_text_field((string) ($payload['type'] ?? ''));

        if (
            $type === 'customer.subscription.updated'
            || $type === 'customer.subscription.deleted'
            || $type === 'invoice.paid'
            || $type === 'invoice.payment_failed'
        ) {
            OG_LMS_Membership_Service::upsert_from_stripe_event($payload);
        }

        if ($type === 'checkout.session.completed') {
            self::capture_customer_mapping($payload);
        }
    }

    private static function capture_customer_mapping(array $payload): void
    {
        global $wpdb;

        $obj = isset($payload['data']['object']) && is_array($payload['data']['object'])
            ? $payload['data']['object']
            : [];

        $customer_id = sanitize_text_field((string) ($obj['customer'] ?? ''));
        $user_id = (int) ($obj['client_reference_id'] ?? 0);
        $tier = sanitize_key((string) ($obj['metadata']['tier'] ?? 'starter'));

        if ($customer_id === '' || $user_id <= 0) {
            return;
        }

        update_user_meta($user_id, 'og_lms_pending_tier', $tier ?: 'starter');

        $table = $wpdb->prefix . 'og_memberships';
        $existing_id = (int) $wpdb->get_var(
            $wpdb->prepare(
                "SELECT id FROM {$table} WHERE user_id = %d LIMIT 1",
                $user_id
            )
        );

        $record = [
            'user_id' => $user_id,
            'tier' => $tier ?: 'starter',
            'status' => 'pending',
            'stripe_customer_id' => $customer_id,
            'updated_at' => OG_LMS_Helpers::now(),
        ];

        if ($existing_id > 0) {
            $wpdb->update($table, $record, ['id' => $existing_id], ['%d', '%s', '%s', '%s', '%s'], ['%d']);
            return;
        }

        $record['created_at'] = OG_LMS_Helpers::now();
        $wpdb->insert($table, $record, ['%d', '%s', '%s', '%s', '%s', '%s']);
    }

    private static function verify_signature(string $payload, string $signature_header): bool
    {
        if ($payload === '' || $signature_header === '') {
            return false;
        }

        $secret = (string) get_option('og_lms_stripe_webhook_secret', '');
        if ($secret === '') {
            return false;
        }

        $timestamp = '';
        $signature = '';

        $parts = array_map('trim', explode(',', $signature_header));
        foreach ($parts as $part) {
            if (str_starts_with($part, 't=')) {
                $timestamp = substr($part, 2);
            }
            if (str_starts_with($part, 'v1=')) {
                $signature = substr($part, 3);
            }
        }

        if ($timestamp === '' || $signature === '') {
            return false;
        }

        $signed_payload = $timestamp . '.' . $payload;
        $expected = hash_hmac('sha256', $signed_payload, $secret);

        return hash_equals($expected, $signature);
    }
}
