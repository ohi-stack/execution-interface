<?php

if (! defined('ABSPATH')) {
    exit;
}

class OG_LMS_Deactivator
{
    public static function deactivate(): void
    {
        flush_rewrite_rules();
    }
}
