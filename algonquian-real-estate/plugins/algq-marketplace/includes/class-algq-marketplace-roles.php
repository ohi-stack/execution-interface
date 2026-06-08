<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

class ALGQ_Marketplace_Roles
{
    public const CAPS = [
        'manage_algq_marketplace',
        'view_algq_marketplace',
        'edit_algq_marketplace_deals',
        'manage_algq_marketplace_settings',
        'view_algq_buyer_activity',
        'submit_algq_buyer_interest',
    ];

    public static function add_roles_and_caps(): void
    {
        add_role('algq_marketplace_manager', __('Marketplace Manager', 'algq-marketplace'), [
            'read' => true,
            'manage_algq_marketplace' => true,
            'view_algq_marketplace' => true,
            'edit_algq_marketplace_deals' => true,
            'manage_algq_marketplace_settings' => true,
            'view_algq_buyer_activity' => true,
        ]);

        add_role('algq_verified_buyer', __('Verified Buyer', 'algq-marketplace'), [
            'read' => true,
            'view_algq_marketplace' => true,
            'submit_algq_buyer_interest' => true,
        ]);

        $administrator = get_role('administrator');
        if ($administrator) {
            foreach (self::CAPS as $cap) {
                $administrator->add_cap($cap);
            }
        }

        $manager = get_role('algq_marketplace_manager');
        if ($manager) {
            foreach (['manage_algq_marketplace', 'view_algq_marketplace', 'edit_algq_marketplace_deals', 'manage_algq_marketplace_settings', 'view_algq_buyer_activity'] as $cap) {
                $manager->add_cap($cap);
            }
        }

        $buyer = get_role('algq_verified_buyer');
        if ($buyer) {
            foreach (['view_algq_marketplace', 'submit_algq_buyer_interest'] as $cap) {
                $buyer->add_cap($cap);
            }
        }
    }

    public static function remove_caps(): void
    {
        foreach (['administrator', 'algq_marketplace_manager', 'algq_verified_buyer'] as $role_name) {
            $role = get_role($role_name);
            if (!$role) {
                continue;
            }

            foreach (self::CAPS as $cap) {
                $role->remove_cap($cap);
            }
        }

        remove_role('algq_marketplace_manager');
        remove_role('algq_verified_buyer');
    }
}
