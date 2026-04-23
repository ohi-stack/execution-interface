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
        OG_LMS_DB_Schema::create_tables();
        flush_rewrite_rules();
    }
}
