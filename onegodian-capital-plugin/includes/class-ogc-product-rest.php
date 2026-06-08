<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class OGC_Product_REST {
	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	public function register_routes() {
		register_rest_route( OGC_REST_NAMESPACE, '/products', array( 'methods' => WP_REST_Server::READABLE, 'callback' => array( $this, 'products' ), 'permission_callback' => array( 'OGC_REST', 'app_key_allowed' ) ) );
		register_rest_route( OGC_REST_NAMESPACE, '/product-sync-status', array( 'methods' => WP_REST_Server::READABLE, 'callback' => array( $this, 'status' ), 'permission_callback' => '__return_true' ) );
		register_rest_route( OGC_REST_NAMESPACE, '/products/sync', array( 'methods' => WP_REST_Server::CREATABLE, 'callback' => array( $this, 'sync' ), 'permission_callback' => array( 'OGC_REST', 'app_key_allowed' ) ) );
	}

	public function products() {
		return rest_ensure_response( array( 'products' => OGC_Product_Sync::instance()->get_products() ) );
	}

	public function status() {
		$status = OGC_Product_Sync::instance()->get_status();
		return rest_ensure_response(
			array(
				'woocommerce_active'    => $status['woocommerce_active'],
				'product_sync_enabled'  => $status['product_sync_enabled'],
				'synced_product_count'  => $status['synced_product_count'],
				'last_product_sync'     => $status['last_product_sync'],
			)
		);
	}

	public function sync() {
		$products = OGC_Product_Sync::instance()->sync_all_products();
		return rest_ensure_response( array( 'synced_product_count' => count( $products ), 'products' => $products ) );
	}
}
