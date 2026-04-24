<?php
if (! defined('ABSPATH')) {
    exit;
}
class OG_LMS_Security
{
    public static function register(): void
    {
        add_filter('upload_mimes', [self::class, 'restrict_mimes']);
    }

    public static function restrict_mimes(array $mimes): array
    {
        $mimes['pdf'] = 'application/pdf';
        return $mimes;
    }
}
