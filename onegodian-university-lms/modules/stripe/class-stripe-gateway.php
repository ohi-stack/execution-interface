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
        register_rest_route('og-lms/v1', '/stripe/webhook', [
            'methods' => 'POST',
            'callback' => [self::class, 'handle_webhook'],
            'permission_callback' => '__return_true',
        ]);
    }

    public static function handle_webhook(WP_REST_Request $request): WP_REST_Response
    {
        return new WP_REST_Response([
            'received' => true,
            'endpoint' => OG_LMS_Helpers::public_base_url() . '/wp-json/og-lms/v1/stripe/webhook',
        ]);
    }
}
