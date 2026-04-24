<?php

if (! defined('ABSPATH')) {
    exit;
}

class OG_LMS_Course_Renderer
{
    public static function register_shortcodes(): void
    {
        add_shortcode('og_course_catalog', [self::class, 'render_catalog']);
        add_shortcode('og_course', [self::class, 'render_course']);
        add_shortcode('og_lesson', [self::class, 'render_lesson']);
    }

    public static function render_catalog(): string
    {
        $query = new WP_Query([
            'post_type' => 'og_course',
            'posts_per_page' => 12,
            'post_status' => 'publish',
        ]);

        ob_start();
        include OG_LMS_PLUGIN_PATH . 'public/views/course-catalog.php';
        return (string) ob_get_clean();
    }

    public static function render_course(array $atts): string
    {
        $atts = shortcode_atts(['id' => 0], $atts);
        $course_id = (int) $atts['id'];

        if (! $course_id) {
            return '';
        }

        $course = get_post($course_id);

        if (! $course || get_post_type($course) !== 'og_course') {
            return '';
        }

        if (! is_user_logged_in()) {
            $login_url = esc_url(OG_LMS_Helpers::public_base_url() . '/login');
            return '<p>Please <a href="' . $login_url . '">log in</a> to access this course.</p>';
        }

        if (! OG_LMS_Membership_Service::can_access_course(get_current_user_id(), $course_id)) {
            $required_tier = OG_LMS_Membership_Service::get_required_tier_for_course($course_id);
            return '<p>This course requires the <strong>' . esc_html($required_tier ?: 'membership') . '</strong> tier.</p>';
        }
        ob_start();
        include OG_LMS_PLUGIN_PATH . 'public/views/course-single.php';
        return (string) ob_get_clean();
    }

    public static function render_lesson(array $atts): string
    {
        $atts = shortcode_atts(['id' => 0], $atts);
        $lesson = get_post((int) $atts['id']);
        return $lesson ? wpautop(wp_kses_post($lesson->post_content)) : '';
    }
}
