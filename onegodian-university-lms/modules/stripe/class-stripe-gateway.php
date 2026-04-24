<?php
if (! defined('ABSPATH')) {
    exit;
}
class OG_LMS_Stripe_Gateway
{
    public static function bootstrap(): void
    {
        add_action('rest_api_init', [self::class, 'register_routes']);
    }

    public static function register_routes(): void
    {
        register_rest_route('og-lms/v1', '/stripe/checkout-session', [
            'methods' => 'POST',
            'callback' => [self::class, 'create_checkout_session'],
            'permission_callback' => function () {
                return is_user_logged_in();
            },
        ]);

        register_rest_route('og-lms/v1', '/stripe/webhook', [
            'methods' => 'POST',
            'callback' => [self::class, 'handle_webhook'],
            'permission_callback' => '__return_true',
        ]);
    }

    public static function create_checkout_session(WP_REST_Request $request): WP_REST_Response
    {
        $user_id = get_current_user_id();
        $course_id = (int) $request->get_param('course_id');

        if (! $course_id || get_post_type($course_id) !== 'og_course') {
            return new WP_REST_Response(['message' => 'Invalid course id'], 400);
        }

        $price_id = trim((string) get_post_meta($course_id, '_og_stripe_price_id', true));
        if ($price_id === '') {
            return new WP_REST_Response(['message' => 'Course is not purchasable yet'], 400);
        }

        $site_url = rtrim(home_url(), '/');
        $success_url = $site_url . '/dashboard?course_id=' . $course_id . '&checkout=success';
        $cancel_url = $site_url . '/course/' . $course_id . '?checkout=cancel';

        $payload = [
            'checkout_url' => 'https://checkout.stripe.com/pay/' . rawurlencode($price_id),
            'price_id' => $price_id,
            'course_id' => $course_id,
            'metadata' => [
                'user_id' => $user_id,
                'course_id' => $course_id,
                'source' => 'og-lms',
            ],
            'success_url' => $success_url,
            'cancel_url' => $cancel_url,
            'message' => 'Use this payload with your secure Stripe server endpoint to create a signed checkout session.',
        ];

        return new WP_REST_Response($payload, 200);
    }

    public static function handle_webhook(WP_REST_Request $request): WP_REST_Response
    {
        $signature = (string) $request->get_header('x-og-lms-signature');
        $secret = OG_LMS_Helpers::get_option('og_lms_stripe_webhook_secret', '');
        $payload = $request->get_body();

        if (! OG_LMS_Helpers::verify_hmac($payload, $signature, $secret)) {
            return new WP_REST_Response(['message' => 'Invalid webhook signature'], 401);
        }

        $event = json_decode($payload, true);
        if (! is_array($event) || ! isset($event['type'])) {
            return new WP_REST_Response(['message' => 'Invalid event payload'], 400);
        }

        if ($event['type'] !== 'checkout.session.completed') {
            return new WP_REST_Response(['received' => true, 'ignored' => true], 200);
        }

        $session = $event['data']['object'] ?? [];
        $metadata = isset($session['metadata']) && is_array($session['metadata']) ? $session['metadata'] : [];

        $user_id = isset($metadata['user_id']) ? (int) $metadata['user_id'] : 0;
        $course_id = isset($metadata['course_id']) ? (int) $metadata['course_id'] : 0;
        $transaction_id = isset($session['id']) ? sanitize_text_field((string) $session['id']) : '';
        $amount_total = isset($session['amount_total']) ? ((float) $session['amount_total'] / 100) : 0;
        $currency = isset($session['currency']) ? strtoupper(sanitize_text_field((string) $session['currency'])) : 'USD';

        if (! $user_id || ! $course_id || $transaction_id === '') {
            return new WP_REST_Response(['message' => 'Missing checkout metadata'], 400);
        }

        OG_LMS_Enrollment_Service::enroll($user_id, $course_id, 'active');
        self::record_payment($user_id, $course_id, $transaction_id, $amount_total, $currency, 'paid');
        OG_LMS_Helpers::log_activity($user_id, 'checkout_completed', 'course', $course_id, [
            'transaction_id' => $transaction_id,
            'amount' => $amount_total,
            'currency' => $currency,
        ]);

        return new WP_REST_Response(['received' => true, 'enrolled' => true], 200);
    }

    private static function record_payment(int $user_id, int $course_id, string $transaction_id, float $amount, string $currency, string $status): void
    {
        global $wpdb;
        $table = $wpdb->prefix . 'og_payments';

        $exists = (int) $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM {$table} WHERE transaction_id = %s LIMIT 1",
            $transaction_id
        ));

        if ($exists > 0) {
            return;
        }

        $wpdb->insert(
            $table,
            [
                'user_id' => $user_id,
                'course_id' => $course_id,
                'provider' => 'stripe',
                'transaction_id' => $transaction_id,
                'amount' => $amount,
                'currency' => $currency,
                'status' => sanitize_key($status),
                'paid_at' => OG_LMS_Helpers::now(),
                'created_at' => OG_LMS_Helpers::now(),
                'updated_at' => OG_LMS_Helpers::now(),
            ],
            ['%d', '%d', '%s', '%s', '%f', '%s', '%s', '%s', '%s', '%s']
        );
    }
}
