<?php
/**
 * Activation routines for Pipeline CRM.
 *
 * @package Algonquian_Pipeline_CRM
 */

if (!defined('ABSPATH')) {
    exit;
}

class ALGQ_Pipeline_Activator
{
    public static function activate(): void
    {
        $database = new ALGQ_Pipeline_Database();
        $database->create_tables();
        $database->seed_default_stages();
        self::add_capabilities();
        update_option('algq_pipeline_crm_version', ALGQ_PIPELINE_CRM_VERSION);
    }

    private static function add_capabilities(): void
    {
        $capabilities = [
            'algq_view_pipeline',
            'algq_manage_pipeline',
            'algq_edit_deals',
            'algq_assign_deals',
            'algq_close_deals',
        ];

        $roles = ['administrator'];
        foreach ($roles as $role_name) {
            $role = get_role($role_name);
            if (!$role) {
                continue;
            }

            foreach ($capabilities as $capability) {
                $role->add_cap($capability);
            }
        }
    }
}
