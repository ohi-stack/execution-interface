<?php
if ( ! defined( 'ABSPATH' ) ) { exit; }

class OG_Connector_Admin {
	private $registry;

	public function __construct( OG_Connector_Registry $registry ) {
		$this->registry = $registry;
		add_action( 'admin_menu', array( $this, 'register_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
	}

	public function register_menu() {
		add_menu_page( __( 'OneGodian Platform', 'onegodian-platform' ), __( 'OneGodian Platform', 'onegodian-platform' ), 'manage_options', 'onegodian-platform', array( $this, 'render_dashboard' ), 'dashicons-superhero', 58 );
		add_submenu_page( 'onegodian-platform', __( 'Dashboard', 'onegodian-platform' ), __( 'Dashboard', 'onegodian-platform' ), 'manage_options', 'onegodian-platform', array( $this, 'render_dashboard' ) );
		add_submenu_page( 'onegodian-platform', __( 'Connectors', 'onegodian-platform' ), __( 'Connectors', 'onegodian-platform' ), 'manage_options', 'onegodian-platform-connectors', array( $this, 'render_connectors' ) );
		add_submenu_page( 'onegodian-platform', __( 'Runtime', 'onegodian-platform' ), __( 'Runtime', 'onegodian-platform' ), 'manage_options', 'onegodian-platform-runtime', array( $this, 'render_runtime' ) );
		add_submenu_page( 'onegodian-platform', __( 'App Bridge', 'onegodian-platform' ), __( 'App Bridge', 'onegodian-platform' ), 'manage_options', 'onegodian-platform-app-bridge', array( $this, 'render_app_bridge' ) );
		add_submenu_page( 'onegodian-platform', __( 'Documentation', 'onegodian-platform' ), __( 'Documentation', 'onegodian-platform' ), 'manage_options', 'onegodian-platform-docs', array( $this, 'render_docs' ) );
	}

	public function enqueue_admin_assets( $hook ) {
		if ( false !== strpos( $hook, 'onegodian-platform' ) ) {
			wp_enqueue_style( 'onegodian-platform', ONEGODIAN_PLATFORM_URL . 'assets/css/onegodian-platform.css', array(), ONEGODIAN_PLATFORM_VERSION );
		}
	}

	public function render_dashboard() {
		$this->wrap_open( __( 'OneGodian Platform Dashboard', 'onegodian-platform' ) );
		echo '<div class="og-admin-grid">';
		$this->widget( 'Plugin Status', 'Version ' . ONEGODIAN_PLATFORM_VERSION . ' active.' );
		$this->widget( 'Runtime Status', 'Health, manifest, tools, and stats endpoints registered.' );
		$this->widget( 'Connectors Status', count( $this->registry->all() ) . ' connectors registered.' );
		$this->widget( 'WooCommerce Status', class_exists( 'WooCommerce' ) ? 'WooCommerce active.' : 'WooCommerce not active; compatibility safely feature-detected.' );
		$this->widget( 'Page Generator', 'Generated pages use OneGodian hero, CTA, compliance footer, and style classes.' );
		$this->widget( 'Pattern Manager', 'OneGodian pattern categories and premium pattern groups registered.' );
		echo '</div>';
		$this->wrap_close();
	}

	public function render_connectors() {
		$this->wrap_open( __( 'Connectors', 'onegodian-platform' ) );
		echo '<table class="widefat striped"><thead><tr><th>Name</th><th>Category</th><th>Configured</th><th>Active</th><th>Description</th></tr></thead><tbody>';
		foreach ( $this->registry->all() as $connector ) {
			echo '<tr><td>' . esc_html( $connector['name'] ) . '</td><td>' . esc_html( $connector['category'] ) . '</td><td>' . esc_html( $connector['configured'] ? 'Yes' : 'No' ) . '</td><td>' . esc_html( $connector['active'] ? 'Yes' : 'No' ) . '</td><td>' . esc_html( $connector['description'] ) . '</td></tr>';
		}
		echo '</tbody></table>';
		$this->wrap_close();
	}

	public function render_runtime() { $this->wrap_open( __( 'Runtime', 'onegodian-platform' ) ); echo '<pre>' . esc_html( wp_json_encode( OG_Platform::runtime_manifest(), JSON_PRETTY_PRINT ) ) . '</pre>'; $this->wrap_close(); }
	public function render_app_bridge() { $this->wrap_open( __( 'App Bridge', 'onegodian-platform' ) ); echo '<p>Use <code>' . esc_html( rest_url( 'onegodian/v1/manifest' ) ) . '</code> as the app runtime manifest source.</p>'; $this->wrap_close(); }
	public function render_docs() { $this->wrap_open( __( 'Documentation', 'onegodian-platform' ) ); echo '<p>See <code>docs/ONEGODIAN_PLATFORM_V1.md</code> in the plugin package for connector, pattern, overlay, and runtime endpoint documentation.</p>'; $this->wrap_close(); }

	private function wrap_open( $title ) { echo '<div class="wrap og-admin"><h1>' . esc_html( $title ) . '</h1>'; }
	private function wrap_close() { echo '</div>'; }
	private function widget( $title, $body ) { echo '<section class="og-card"><h2>' . esc_html( $title ) . '</h2><p>' . esc_html( $body ) . '</p></section>'; }
}
