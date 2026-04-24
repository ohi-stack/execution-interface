<?php

if (! defined('ABSPATH')) {
    exit;
}

class OG_LMS_Progress_Service
{
    public static function get_course_progress(int $user_id, int $course_id): float
    {
        global $wpdb;
        $table = $wpdb->prefix . 'og_progress';

        $sql = $wpdb->prepare(
            "SELECT AVG(completion_percent) FROM {$table} WHERE user_id = %d AND course_id = %d",
            $user_id,
            $course_id
        );

        $value = $wpdb->get_var($sql);
        return $value !== null ? round((float) $value, 2) : 0.0;
    }

    public static function upsert_progress(int $user_id, int $course_id, int $lesson_id, float $completion_percent): void
    {
        global $wpdb;
        $table = $wpdb->prefix . 'og_progress';

        $existing_id = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM {$table} WHERE user_id = %d AND course_id = %d AND lesson_id = %d LIMIT 1",
            $user_id,
            $course_id,
            $lesson_id
        ));

        $payload = [
            'completion_percent' => min(100, max(0, $completion_percent)),
            'completed_at' => $completion_percent >= 100 ? OG_LMS_Helpers::now() : null,
            'updated_at' => OG_LMS_Helpers::now(),
        ];

        if ($existing_id) {
            $wpdb->update(
                $table,
                $payload,
                ['id' => (int) $existing_id],
                ['%f', '%s', '%s'],
                ['%d']
            );

            return;
        }

        $wpdb->insert(
            $table,
            array_merge($payload, [
                'user_id' => $user_id,
                'course_id' => $course_id,
                'lesson_id' => $lesson_id,
                'created_at' => OG_LMS_Helpers::now(),
            ]),
            ['%f', '%s', '%s', '%d', '%d', '%d', '%s']
        );
    }

    public static function rest_update(WP_REST_Request $request): WP_REST_Response
    {
        $user_id = get_current_user_id();
        $course_id = (int) $request->get_param('course_id');
        $lesson_id = (int) $request->get_param('lesson_id');
        $completion = (float) $request->get_param('completion_percent');

        if (! $course_id || ! $lesson_id || $completion < 0 || $completion > 100) {
            return new WP_REST_Response(['message' => 'Invalid progress payload'], 400);
        }

        if (! OG_LMS_Enrollment_Service::is_enrolled($user_id, $course_id)) {
            return new WP_REST_Response(['message' => 'Enrollment required'], 403);
        }

        self::upsert_progress($user_id, $course_id, $lesson_id, $completion);

        return new WP_REST_Response([
            'message' => 'Progress saved',
            'course_progress' => self::get_course_progress($user_id, $course_id),
        ], 200);
    }
}
