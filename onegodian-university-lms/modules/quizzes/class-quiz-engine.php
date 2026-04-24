<?php
if (! defined('ABSPATH')) {
    exit;
}
class OG_LMS_Quiz_Engine
{
    public static function bootstrap(): void
    {
        add_shortcode('og_quiz', [self::class, 'render']);
    }

    public static function render(array $atts): string
    {
        $atts = shortcode_atts(['id' => 0], $atts);
        $quiz_id = (int) $atts['id'];

        if (! $quiz_id) {
            return '';
        }

        return '<div class="og-lms-card">Quiz #' . esc_html((string) $quiz_id) . ' scaffold: timer, retries, randomization, auto/manual grading.</div>';
    }
}
