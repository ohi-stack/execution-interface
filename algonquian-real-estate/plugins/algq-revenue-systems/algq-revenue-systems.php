<?php
/**
 * Plugin Name: Algonquian Revenue Systems
 * Description: WooCommerce monetization rails for digital products, subscription tiers, protected downloads, license keys, and Stripe readiness.
 * Version: 0.1.0
 * Author: Algonquian Real Estate
 * Text Domain: algq-revenue-systems
 *
 * @package Algonquian_Real_Estate
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once plugin_dir_path( __FILE__ ) . 'includes/class-algq-revenue-systems.php';

ALGQ_Revenue_Systems::boot();
