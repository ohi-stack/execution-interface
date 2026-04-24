<?php
if (! defined('ABSPATH')) {
    exit;
}
class OG_LMS_WooCommerce_Integration
{
    public static function bootstrap(): void
    {
        add_action('woocommerce_order_status_completed', [self::class, 'handle_order_completed']);
    }

    public static function handle_order_completed(int $order_id): void
    {
        if (! function_exists('wc_get_order')) {
            return;
        }

        $order = wc_get_order($order_id);
        if (! $order) {
            return;
        }

        $user_id = (int) $order->get_user_id();
        foreach ($order->get_items() as $item) {
            $course_id = (int) wc_get_order_item_meta($item->get_id(), '_og_course_id', true);
            if ($course_id > 0) {
                OG_LMS_Enrollment_Service::enroll($user_id, $course_id, 'active');
            }
        }
    }
}
