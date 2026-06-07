<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

class OG_Connector_Registry {
	private $connectors = array();

	public function __construct() {
		$this->register_defaults();
	}

	public function register( $slug, array $args ) {
		$this->connectors[ sanitize_key( $slug ) ] = wp_parse_args(
			$args,
			array(
				'name'        => $slug,
				'description' => '',
				'configured'  => false,
				'active'      => false,
				'category'    => 'runtime',
			)
		);
	}

	public function all() {
		return $this->connectors;
	}

	public function status() {
		$status = array();
		foreach ( $this->connectors as $slug => $connector ) {
			$status[ $slug ] = array(
				'name'       => $connector['name'],
				'configured' => (bool) $connector['configured'],
				'active'     => (bool) $connector['active'],
				'category'   => $connector['category'],
			);
		}
		return $status;
	}

	public function test( $slug = '' ) {
		if ( $slug && isset( $this->connectors[ $slug ] ) ) {
			return $this->test_one( $slug, $this->connectors[ $slug ] );
		}
		$results = array();
		foreach ( $this->connectors as $key => $connector ) {
			$results[ $key ] = $this->test_one( $key, $connector );
		}
		return $results;
	}

	private function test_one( $slug, array $connector ) {
		return array(
			'slug'       => $slug,
			'name'       => $connector['name'],
			'ok'         => (bool) $connector['active'],
			'configured' => (bool) $connector['configured'],
			'message'    => $connector['active'] ? __( 'Connector available.', 'onegodian-platform' ) : __( 'Connector registered; configure credentials or activate dependency when needed.', 'onegodian-platform' ),
		);
	}

	private function register_defaults() {
		$this->register( 'omos-runtime', array( 'name' => 'OMOS Runtime', 'description' => 'OneGodian Mission Operating System runtime bridge.', 'configured' => true, 'active' => true, 'category' => 'runtime' ) );
		$this->register( 'ohi-runtime', array( 'name' => 'OHI Runtime', 'description' => 'OneGodian Health Infrastructure runtime bridge.', 'configured' => true, 'active' => true, 'category' => 'runtime' ) );
		$this->register( 'qrv-network', array( 'name' => 'QRV Network', 'description' => 'QRV ecosystem network connector.', 'configured' => true, 'active' => true, 'category' => 'network' ) );
		$this->register( 'woocommerce', array( 'name' => 'WooCommerce', 'description' => 'WooCommerce commerce compatibility layer.', 'configured' => class_exists( 'WooCommerce' ), 'active' => class_exists( 'WooCommerce' ), 'category' => 'commerce' ) );
		$this->register( 'stripe', array( 'name' => 'Stripe', 'description' => 'Stripe payment connector placeholder.', 'configured' => (bool) get_option( 'og_stripe_enabled', false ), 'active' => (bool) get_option( 'og_stripe_enabled', false ), 'category' => 'payments' ) );
		$this->register( 'openai', array( 'name' => 'OpenAI', 'description' => 'OpenAI assistant and generation connector.', 'configured' => (bool) get_option( 'og_openai_api_key', '' ), 'active' => (bool) get_option( 'og_openai_api_key', '' ), 'category' => 'ai' ) );
		$this->register( 'gemini', array( 'name' => 'Gemini', 'description' => 'Gemini AI connector.', 'configured' => (bool) get_option( 'og_gemini_api_key', '' ), 'active' => (bool) get_option( 'og_gemini_api_key', '' ), 'category' => 'ai' ) );
		$this->register( 'claude', array( 'name' => 'Claude', 'description' => 'Claude AI connector.', 'configured' => (bool) get_option( 'og_claude_api_key', '' ), 'active' => (bool) get_option( 'og_claude_api_key', '' ), 'category' => 'ai' ) );
		$this->register( 'grok', array( 'name' => 'Grok', 'description' => 'Grok AI connector.', 'configured' => (bool) get_option( 'og_grok_api_key', '' ), 'active' => (bool) get_option( 'og_grok_api_key', '' ), 'category' => 'ai' ) );
	}
}
