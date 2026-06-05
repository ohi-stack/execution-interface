<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

class OG_Platform {
	private static $instance;
	private $registry;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public static function activate() {
		update_option( 'onegodian_platform_version', ONEGODIAN_PLATFORM_VERSION );
		self::generate_pages();
		flush_rewrite_rules();
	}

	private function __construct() {
		$this->registry = new OG_Connector_Registry();
		new OG_Connectors( $this->registry );
		new OG_Connector_Admin( $this->registry );
		new OG_Patterns();
		new OG_Navigation_Overlays();
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'rest_api_init', array( $this, 'register_runtime_routes' ) );
		add_action( 'init', array( $this, 'register_shortcodes' ) );
	}

	public function enqueue_assets() {
		wp_enqueue_style( 'onegodian-platform', ONEGODIAN_PLATFORM_URL . 'assets/css/onegodian-platform.css', array(), ONEGODIAN_PLATFORM_VERSION );
	}

	public function register_runtime_routes() {
		register_rest_route( 'onegodian/v1', '/health', array( 'methods' => 'GET', 'callback' => array( $this, 'health' ), 'permission_callback' => '__return_true' ) );
		register_rest_route( 'onegodian/v1', '/manifest', array( 'methods' => 'GET', 'callback' => array( $this, 'manifest' ), 'permission_callback' => '__return_true' ) );
		register_rest_route( 'onegodian/v1', '/tools', array( 'methods' => 'GET', 'callback' => array( $this, 'tools' ), 'permission_callback' => '__return_true' ) );
		register_rest_route( 'onegodian/v1', '/stats', array( 'methods' => 'GET', 'callback' => array( $this, 'stats' ), 'permission_callback' => '__return_true' ) );
	}

	public function health() {
		return rest_ensure_response( array( 'status' => 'ok', 'plugin' => 'onegodian-platform', 'version' => ONEGODIAN_PLATFORM_VERSION, 'timestamp' => current_time( 'mysql' ), 'woocommerce_compatible' => true ) );
	}

	public function manifest() {
		return rest_ensure_response( self::runtime_manifest() );
	}

	public function tools() {
		return rest_ensure_response( array( 'version' => ONEGODIAN_PLATFORM_VERSION, 'tools' => array( 'page_generator', 'pattern_manager', 'connector_registry', 'navigation_overlays', 'template_library' ) ) );
	}

	public function stats() {
		return rest_ensure_response( array( 'version' => ONEGODIAN_PLATFORM_VERSION, 'stats' => array( 'connectors' => count( $this->registry->all() ), 'patterns' => 21, 'overlays' => 4, 'generated_pages' => count( get_option( 'onegodian_platform_generated_pages', array() ) ) ) ) );
	}

	public static function runtime_manifest() {
		return array(
			'name'      => 'OneGodian Platform',
			'version'   => ONEGODIAN_PLATFORM_VERSION,
			'namespace' => 'onegodian/v1',
			'endpoints' => array( '/health', '/manifest', '/tools', '/stats', '/connectors', '/connectors/status', '/connectors/test' ),
			'features'  => array( 'connectors_api', 'pattern_api', 'navigation_overlays', 'premium_style_system', 'runtime_endpoints', 'unified_templates', 'admin_dashboard' ),
		);
	}

	public function register_shortcodes() {
		$shortcodes = array(
			'onegodian_platform_hero'        => array( $this, 'shortcode_hero' ),
			'onegodian_platform_cta'         => array( $this, 'shortcode_cta' ),
			'onegodian_compliance_footer'    => array( $this, 'shortcode_compliance' ),
			'onegodian_feature_grid'         => array( $this, 'shortcode_feature_grid' ),
			'onegodian_belief_mapper'        => array( $this, 'legacy_placeholder' ),
			'onegodian_member_resources'     => array( $this, 'legacy_placeholder' ),
			'onegodian_contributor_portal'   => array( $this, 'legacy_placeholder' ),
			'onegodian_membership_pricing'   => array( $this, 'legacy_placeholder' ),
		);
		foreach ( $shortcodes as $tag => $callback ) {
			if ( ! shortcode_exists( $tag ) ) {
				add_shortcode( $tag, $callback );
			}
		}
	}

	public function shortcode_hero( $atts ) {
		$atts = shortcode_atts( array( 'title' => 'Establish A Home For OneGodian™', 'subtitle' => 'Premium OneGodian infrastructure for connected pages and runtime experiences.', 'variant' => 'standard' ), $atts, 'onegodian_platform_hero' );
		return OG_Template_Library::hero( $atts['title'], $atts['subtitle'], $atts['variant'] );
	}
	public function shortcode_cta() { return OG_Template_Library::cta_section(); }
	public function shortcode_compliance() { return OG_Template_Library::compliance_footer(); }
	public function shortcode_feature_grid() { return OG_Template_Library::feature_grid(); }

	public function legacy_placeholder( $atts, $content = '', $tag = '' ) {
		return '<section class="og-section og-legacy-module"><div class="og-container"><div class="og-card"><p class="og-kicker">Backward Compatible Module</p><h2>' . esc_html( ucwords( str_replace( '_', ' ', $tag ) ) ) . '</h2><p>Legacy shortcode output is preserved as a styled OneGodian module. Install or activate the dedicated module plugin for live data.</p>' . do_shortcode( $content ) . '</div></div></section>';
	}

	public static function generate_pages() {
		if ( ! function_exists( 'wp_insert_post' ) ) {
			return;
		}
		$pages = array(
			'OneGodian Home'       => array( 'slug' => 'onegodian-home', 'shortcode' => '' ),
			'OneGodian Support'    => array( 'slug' => 'onegodian-support', 'shortcode' => '[onegodian_platform_cta]' ),
			'OneGodian Connectors' => array( 'slug' => 'onegodian-connectors', 'shortcode' => '[onegodian_ecosystem_overlay]' ),
		);
		$generated = get_option( 'onegodian_platform_generated_pages', array() );
		foreach ( $pages as $title => $config ) {
			$existing = get_page_by_path( $config['slug'] );
			if ( $existing ) {
				$generated[ $config['slug'] ] = $existing->ID;
				continue;
			}
			$page_id = wp_insert_post( array( 'post_title' => $title, 'post_name' => $config['slug'], 'post_status' => 'publish', 'post_type' => 'page', 'post_content' => OG_Template_Library::page( $title, 'Generated with the OneGodian Premium Infrastructure Standard.', $config['shortcode'] ), 'meta_input' => array( '_onegodian_generated' => ONEGODIAN_PLATFORM_VERSION ) ) );
			if ( ! is_wp_error( $page_id ) ) {
				$generated[ $config['slug'] ] = $page_id;
			}
		}
		update_option( 'onegodian_platform_generated_pages', $generated );
	}
}
