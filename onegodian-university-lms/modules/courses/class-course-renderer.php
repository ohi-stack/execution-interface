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
