<?php
/**
 * Deactivation tasks for Deal Marketplace.
 *
 * @package Algonquian_Deal_Marketplace
 */

if (!defined('ABSPATH')) {
    exit;
}

final class ALGQ_Deal_Marketplace_Deactivator
{
    public static function deactivate(): void
    {
        flush_rewrite_rules();
    }
}
