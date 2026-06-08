<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

class ALGQ_Marketplace_Activator
{
    public static function activate(): void
    {
        if (!get_option(ALGQ_MARKETPLACE_OPTION_SETTINGS)) {
            add_option(ALGQ_MARKETPLACE_OPTION_SETTINGS, algq_marketplace_default_settings());
        }

        add_option(ALGQ_MARKETPLACE_OPTION_CLEANUP, ['cleanup_tables' => 'no', 'cleanup_generated_pages' => 'no']);
        ALGQ_Marketplace_DB::create_tables();
        ALGQ_Marketplace_Roles::add_roles_and_caps();
        ALGQ_Marketplace_Pages::generate_pages();
        flush_rewrite_rules();
        algq_marketplace_log_activity('activation', __('Plugin activated and marketplace foundations created.', 'algq-marketplace'));
    }

    public static function deactivate(): void
    {
        flush_rewrite_rules();
    }
}
