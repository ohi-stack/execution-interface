<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class OGC_REST {
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
		register_rest_route( OGC_REST_NAMESPACE, '/manifest', array( 'methods' => WP_REST_Server::READABLE, 'callback' => array( $this, 'manifest' ), 'permission_callback' => '__return_true' ) );
		register_rest_route( OGC_REST_NAMESPACE, '/health', array( 'methods' => WP_REST_Server::READABLE, 'callback' => array( $this, 'health' ), 'permission_callback' => '__return_true' ) );
	}

	public function manifest() {
		$status = OGC_Product_Sync::instance()->get_status();
		return rest_ensure_response(
			array(
				'module'             => 'onegodian-capital',
				'version'            => OGC_VERSION,
				'woocommerce_sync'   => true,
				'product_count'      => $status['synced_product_count'],
				'capital_website'    => $status['capital_website_url'],
				'app_dashboard'      => $status['app_product_dashboard_url'],
				'endpoints'          => array(
					'health'              => '/wp-json/onegodian-capital/v1/health',
					'manifest'            => '/wp-json/onegodian-capital/v1/manifest',
					'products'            => '/wp-json/onegodian-capital/v1/products',
					'product_sync_status' => '/wp-json/onegodian-capital/v1/product-sync-status',
				),
			)
		);
	}

	public function health() {
		$status = OGC_Product_Sync::instance()->get_status();
		return rest_ensure_response(
			array(
				'status'                => 'ok',
				'module'                => 'onegodian-capital',
				'version'               => OGC_VERSION,
				'woocommerce_active'    => $status['woocommerce_active'],
				'product_sync_enabled'  => $status['product_sync_enabled'],
				'synced_product_count'  => $status['synced_product_count'],
				'last_product_sync'     => $status['last_product_sync'],
			)
		);
	}

	public static function app_key_allowed( $request ) {
		$key = get_option( 'ogc_app_bridge_key', '' );
		if ( empty( $key ) ) {
			return current_user_can( 'manage_options' );
		}
		$provided = $request->get_header( 'X-OMOS-App-Key' );
		if ( hash_equals( (string) $key, (string) $provided ) ) {
			return true;
		}
		return current_user_can( 'manage_options' );
	}
}
