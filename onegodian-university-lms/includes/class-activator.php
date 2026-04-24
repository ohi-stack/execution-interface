<?php

if (! defined('ABSPATH')) {
    exit;
}

class OG_LMS_Activator
{
    public static function activate(): void
    {
        OG_LMS_Post_Types::register();
        OG_LMS_Roles::register();
        OG_LMS_Migrations::run();
        flush_rewrite_rules();
    }
}
