<?php
if (! defined('ABSPATH')) {
    exit;
}
class OG_LMS_REST_API
{
    public static function register_routes(): void
    {
        register_rest_route('og-lms/v1', '/enroll', [
            'methods' => 'POST',
            'callback' => [OG_LMS_Enrollment_Service::class, 'rest_enroll'],
            'permission_callback' => function () {
                return current_user_can('read');
            },
        ]);

        register_rest_route('og-lms/v1', '/progress', [
            'methods' => 'POST',
            'callback' => [self::class, 'post_progress'],
            'permission_callback' => function () {
                return current_user_can('read');
            },
        ]);

        register_rest_route('og-lms/v1', '/progress/(?P<course_id>\d+)', [
            'methods' => 'GET',
            'callback' => [self::class, 'get_progress'],
            'permission_callback' => function () {
                return current_user_can('read');
            },
        ]);

        register_rest_route('og-lms/v1', '/certificates/issue', [
            'methods' => 'POST',
            'callback' => [OG_LMS_Certificate_Generator::class, 'rest_issue'],
            'permission_callback' => function () {
                return current_user_can('read');
            },
        ]);

        register_rest_route('og-lms/v1', '/metrics', [
            'methods' => 'GET',
            'callback' => [self::class, 'get_metrics'],
            'permission_callback' => function () {
                return current_user_can('manage_options');
            },
        ]);
    }

    public static function post_progress(WP_REST_Request $request): WP_REST_Response
    {
        if (! self::is_rate_limited('progress')) {
            return new WP_REST_Response(['message' => 'Too many requests'], 429);
        }

        return OG_LMS_Progress_Service::rest_update($request);
    }

    public static function get_progress(WP_REST_Request $request): WP_REST_Response
    {
        $user_id = get_current_user_id();
        $course_id = (int) $request->get_param('course_id');

        if (! $course_id) {
            return new WP_REST_Response(['message' => 'Invalid course id'], 400);
        }

        if (! OG_LMS_Enrollment_Service::is_enrolled($user_id, $course_id)) {
            return new WP_REST_Response(['message' => 'Enrollment required'], 403);
        }

        return new WP_REST_Response([
            'course_id' => $course_id,
            'progress_percent' => OG_LMS_Progress_Service::get_course_progress($user_id, $course_id),
        ], 200);
    }

    public static function get_metrics(): WP_REST_Response
    {
        global $wpdb;
        $enrollments_table = $wpdb->prefix . 'og_enrollments';
        $payments_table = $wpdb->prefix . 'og_payments';

        $total_enrollments = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$enrollments_table}");
        $active_enrollments = (int) $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$enrollments_table} WHERE status = %s", 'active'));
        $gross_revenue = (float) $wpdb->get_var($wpdb->prepare("SELECT COALESCE(SUM(amount), 0) FROM {$payments_table} WHERE status = %s", 'paid'));

        return new WP_REST_Response([
            'enrollments' => $total_enrollments,
            'active_enrollments' => $active_enrollments,
            'gross_revenue_usd' => round($gross_revenue, 2),
        ], 200);
    }

    private static function is_rate_limited(string $bucket): bool
    {
        $ip = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : 'unknown';
        return OG_LMS_Helpers::enforce_rate_limit('og_lms_' . $bucket, $ip, 120, 60);
    }
}
