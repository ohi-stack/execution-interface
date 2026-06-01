<?php
/**
 * Capability management for Deal Marketplace.
 *
 * @package Algonquian_Deal_Marketplace
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Marketplace_Capabilities
{
    /**
     * @return array<string>
     */
    public static function capabilities(): array
    {
        return [
            'algq_manage_deal_marketplace',
            'algq_view_deal_marketplace',
            'algq_submit_deal_interest',
            'algq_manage_deal_ndas',
        ];
    }

    public static function install(): void
    {
        $administrator = get_role('administrator');

        if ($administrator) {
            foreach (self::capabilities() as $capability) {
                $administrator->add_cap($capability);
            }
        }

        $subscriber = get_role('subscriber');

        if ($subscriber) {
            $subscriber->add_cap('algq_view_deal_marketplace');
            $subscriber->add_cap('algq_submit_deal_interest');
        }
    }

    public static function remove(): void
    {
        foreach (['administrator', 'subscriber'] as $role_name) {
            $role = get_role($role_name);

            if (!$role) {
                continue;
            }

            foreach (self::capabilities() as $capability) {
                $role->remove_cap($capability);
            }
        }
    }
}
