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
    }
}
