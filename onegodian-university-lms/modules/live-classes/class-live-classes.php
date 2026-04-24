<?php
if (! defined('ABSPATH')) {
    exit;
}
class OG_LMS_Live_Classes
{
    public static function bootstrap(): void
    {
        add_shortcode('og_live_classes', [self::class, 'render']);
    }

    public static function render(): string
    {
        return '<div class="og-lms-card">Live classes listing and Zoom joins at ' . esc_html(OG_LMS_Helpers::public_base_url() . '/live-classes') . '</div>';
    }
}
