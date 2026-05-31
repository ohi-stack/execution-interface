<?php
/**
 * Plugin Name: Algonquian Revenue Systems
 * Description: WooCommerce revenue operating system for digital products, licensing, memberships, subscriptions, protected downloads, dashboards, and SaaS billing.
 * Version: 0.2.0
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
