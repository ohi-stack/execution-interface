<?php
if (! defined('ABSPATH')) {
    exit;
}
class OG_LMS_Tutor_Migration
{
    public static function bootstrap(): void
    {
        add_action('admin_menu', [self::class, 'register_page']);
    }

    public static function register_page(): void
    {
        add_submenu_page(
            'tools.php',
            'Tutor LMS Migration',
            'Tutor Migration',
            'manage_options',
            'og-tutor-migration',
            [self::class, 'render_page']
        );
    }

    public static function render_page(): void
    {
        echo '<div class="wrap og-lms-admin-wrap"><h1>Tutor LMS Migration</h1>';
        echo '<p>Dry-run, batch processing, resumable migration scaffold.</p>';
        echo '<p>Target base URL: ' . esc_html(OG_LMS_Helpers::public_base_url()) . '</p></div>';
    }
}
