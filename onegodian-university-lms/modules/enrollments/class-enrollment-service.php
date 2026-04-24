<?php

if (! defined('ABSPATH')) {
    exit;
}

class OG_LMS_Enrollment_Service
{
    public static function enroll(int $user_id, int $course_id, string $status = 'active'): int
    {
        global $wpdb;
        $table = $wpdb->prefix . 'og_enrollments';

        $wpdb->insert(
            $table,
            [
                'user_id' => $user_id,
                'course_id' => $course_id,
                'status' => sanitize_key($status),
                'enrolled_at' => OG_LMS_Helpers::now(),
                'created_at' => OG_LMS_Helpers::now(),
                'updated_at' => OG_LMS_Helpers::now(),
            ],
            ['%d', '%d', '%s', '%s', '%s', '%s']
        );

        return (int) $wpdb->insert_id;
    }

    public static function is_enrolled(int $user_id, int $course_id): bool
    {
        global $wpdb;
        $table = $wpdb->prefix . 'og_enrollments';
        $sql = $wpdb->prepare(
            "SELECT id FROM {$table} WHERE user_id = %d AND course_id = %d AND status = %s LIMIT 1",
            $user_id,
            $course_id,
            'active'
        );

        return (bool) $wpdb->get_var($sql);
    }

    public static function rest_enroll(WP_REST_Request $request): WP_REST_Response
    {
        $user_id = get_current_user_id();
        $course_id = (int) $request->get_param('course_id');

        if (! $course_id || get_post_type($course_id) !== 'og_course') {
            return new WP_REST_Response(['message' => 'Invalid course id'], 400);
        }

        if (self::is_enrolled($user_id, $course_id)) {
            return new WP_REST_Response(['message' => 'Already enrolled'], 200);
        }

        if (! OG_LMS_Membership_Service::can_access_course($user_id, $course_id)) {
            return new WP_REST_Response(['message' => 'Membership tier required'], 403);
        }

        $enrollment_id = self::enroll($user_id, $course_id);

        return new WP_REST_Response([
            'message' => 'Enrollment created',
            'enrollment_id' => $enrollment_id,
            'dashboard_url' => OG_LMS_Helpers::public_base_url() . '/dashboard',
        ], 201);
    }
}
