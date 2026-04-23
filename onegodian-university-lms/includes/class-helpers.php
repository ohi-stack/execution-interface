<?php
if (! defined('ABSPATH')) {
    exit;
}
class OG_LMS_Helpers
{
    public static function now(): string
    {
        return gmdate('Y-m-d H:i:s');
    }

    public static function public_base_url(): string
    {
        return 'https://u.onegodian.org';
    }
}
