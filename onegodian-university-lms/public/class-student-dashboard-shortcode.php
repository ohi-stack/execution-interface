<?php

if (! defined('ABSPATH')) {
    exit;
}

class OG_LMS_Student_Dashboard_Shortcode
{
    public static function register(): void
    {
        add_shortcode('og_student_dashboard', [self::class, 'render']);
    }

    public static function render(): string
    {
        if (! is_user_logged_in()) {
            $login_url = esc_url(OG_LMS_Helpers::public_base_url() . '/login');
            return '<p>Please <a href="' . $login_url . '">log in</a> to view your dashboard.</p>';
        }

        $user_id = get_current_user_id();
        $courses = self::get_enrolled_courses($user_id);
        $membership = OG_LMS_Membership_Service::get_active_membership($user_id);
        $locked_courses = self::get_locked_courses($user_id);

        ob_start();
        include OG_LMS_PLUGIN_PATH . 'public/views/student-dashboard.php';

        return (string) ob_get_clean();
    }

    private static function get_enrolled_courses(int $user_id): array
    {
        global $wpdb;
        $table = $wpdb->prefix . 'og_enrollments';

        $sql = $wpdb->prepare(
            "SELECT course_id FROM {$table} WHERE user_id = %d AND status = %s ORDER BY enrolled_at DESC",
            $user_id,
            'active'
        );

        $course_ids = array_map('intval', (array) $wpdb->get_col($sql));

        return array_map(
            static fn (int $id) => [
                'id' => $id,
                'title' => get_the_title($id),
                'url' => get_permalink($id),
            ],
            $course_ids
        );
    }

    private static function get_locked_courses(int $user_id): array
    {
        $query = new WP_Query([
            'post_type' => 'og_course',
            'posts_per_page' => 8,
            'post_status' => 'publish',
            'fields' => 'ids',
        ]);

        $locked = [];
        foreach ((array) $query->posts as $course_id) {
            $course_id = (int) $course_id;
            if (OG_LMS_Membership_Service::can_access_course($user_id, $course_id)) {
                continue;
            }

            $locked[] = [
                'id' => $course_id,
                'title' => get_the_title($course_id),
                'required_tier' => OG_LMS_Membership_Service::get_required_tier_for_course($course_id) ?: 'membership',
            ];
        }

        return $locked;
    }
}
