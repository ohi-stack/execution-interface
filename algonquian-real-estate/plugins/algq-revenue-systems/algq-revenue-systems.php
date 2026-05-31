<?php
/**
 * Plugin Name: Algonquian Revenue Systems
 * Description: WooCommerce monetization rails for digital products, subscription tiers, protected downloads, license keys, and Stripe readiness.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 * Requires Plugins: algq-core
 * Text Domain: algq-revenue-systems
 *
 * @package Algonquian_Real_Estate
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


function algq_revenue_systems_core_available(): bool
{
    if (function_exists('algq_core')) {
        return true;
    }

    add_action('admin_notices', static function (): void {
        echo '<div class="notice notice-error"><p>' . esc_html__('Algonquian Revenue Systems requires the Algonquian Core plugin to be active.', 'algq-revenue-systems') . '</p></div>';
    });

    return false;
}

require_once plugin_dir_path( __FILE__ ) . 'includes/class-algq-revenue-systems.php';

add_action('plugins_loaded', static function (): void {
	if ( ! algq_revenue_systems_core_available() ) {
		return;
	}

	ALGQ_Revenue_Systems::boot();
});
