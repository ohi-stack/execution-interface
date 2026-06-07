<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

class OG_Connectors {
	private $registry;

	public function __construct( OG_Connector_Registry $registry ) {
		$this->registry = $registry;
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	public function register_routes() {
		register_rest_route( 'onegodian/v1', '/connectors', array( 'methods' => 'GET', 'callback' => array( $this, 'get_connectors' ), 'permission_callback' => '__return_true' ) );
		register_rest_route( 'onegodian/v1', '/connectors/status', array( 'methods' => 'GET', 'callback' => array( $this, 'get_status' ), 'permission_callback' => '__return_true' ) );
		register_rest_route( 'onegodian/v1', '/connectors/test', array( 'methods' => array( 'GET', 'POST' ), 'callback' => array( $this, 'test_connectors' ), 'permission_callback' => array( $this, 'can_manage' ), 'args' => array( 'connector' => array( 'sanitize_callback' => 'sanitize_key' ) ) ) );
	}

	public function get_connectors() { return rest_ensure_response( array( 'version' => ONEGODIAN_PLATFORM_VERSION, 'connectors' => $this->registry->all() ) ); }
	public function get_status() { return rest_ensure_response( array( 'version' => ONEGODIAN_PLATFORM_VERSION, 'status' => $this->registry->status() ) ); }
	public function test_connectors( WP_REST_Request $request ) { return rest_ensure_response( array( 'version' => ONEGODIAN_PLATFORM_VERSION, 'results' => $this->registry->test( $request->get_param( 'connector' ) ) ) ); }
	public function can_manage() { return current_user_can( 'manage_options' ); }
}
