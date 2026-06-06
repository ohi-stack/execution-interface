<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class OGC_Admin {
	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'admin_menu', array( $this, 'register_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		add_action( 'admin_init', array( $this, 'handle_actions' ) );
	}

	public function register_menu() {
		add_menu_page( 'OneGodian Capital', 'OneGodian Capital', 'manage_options', 'onegodian-capital', array( $this, 'render_dashboard' ), 'dashicons-chart-area', 58 );
		add_submenu_page( 'onegodian-capital', 'Product Sync', 'Product Sync', 'manage_options', 'onegodian-capital-product-sync', array( $this, 'render_product_sync' ) );
	}

	public function enqueue_assets( $hook ) {
		if ( false !== strpos( $hook, 'onegodian-capital' ) ) {
			wp_enqueue_style( 'ogc-admin-capital', OGC_URL . 'assets/admin-capital.css', array(), OGC_VERSION );
		}
	}

	public function handle_actions() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		if ( isset( $_POST['ogc_save_product_sync'] ) && check_admin_referer( 'ogc_product_sync_settings' ) ) {
			update_option( 'ogc_product_sync_enabled', ! empty( $_POST['ogc_product_sync_enabled'] ) );
			$categories = isset( $_POST['ogc_product_sync_categories'] ) ? array_map( 'sanitize_text_field', (array) $_POST['ogc_product_sync_categories'] ) : array();
			update_option( 'ogc_product_sync_categories', $categories, false );
			update_option( 'ogc_capital_website_url', esc_url_raw( $_POST['ogc_capital_website_url'] ?? '' ), false );
			update_option( 'ogc_app_product_dashboard_url', esc_url_raw( $_POST['ogc_app_product_dashboard_url'] ?? '' ), false );
			wp_safe_redirect( add_query_arg( 'ogc_message', 'settings-saved', wp_get_referer() ) );
			exit;
		}

		if ( isset( $_POST['ogc_sync_products_now'] ) && check_admin_referer( 'ogc_product_sync_now' ) ) {
			OGC_Product_Sync::instance()->sync_all_products();
			wp_safe_redirect( add_query_arg( 'ogc_message', 'sync-complete', wp_get_referer() ) );
			exit;
		}
	}

	public function render_dashboard() {
		$sync   = OGC_Product_Sync::instance();
		$status = $sync->get_status();
		include OGC_PATH . 'admin/views/dashboard.php';
	}

	public function render_product_sync() {
		$sync       = OGC_Product_Sync::instance();
		$status     = $sync->get_status();
		$log        = $sync->get_log();
		$categories = get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => false ) );
		include OGC_PATH . 'admin/views/product-sync.php';
	}
}
