<?php
if (! defined('ABSPATH')) {
    exit;
}
class OG_LMS_Assets
{
    public static function enqueue_public(): void
    {
        wp_enqueue_style('og-lms-public', OG_LMS_PLUGIN_URL . 'public/assets/css/og-lms-public.css', [], OG_LMS_VERSION);
    }

    public static function enqueue_admin(): void
    {
        wp_enqueue_style('og-lms-admin', OG_LMS_PLUGIN_URL . 'admin/assets/css/og-lms-admin.css', [], OG_LMS_VERSION);
    }
}
