<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class OGC_App_Bridge {
	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_filter( 'ogc_app_bridge_payload', array( $this, 'append_products' ) );
	}

	public function append_products( $payload ) {
		$payload['product_sync'] = OGC_Product_Sync::instance()->get_status();
		$payload['products']      = OGC_Product_Sync::instance()->get_products();
		return $payload;
	}
}
