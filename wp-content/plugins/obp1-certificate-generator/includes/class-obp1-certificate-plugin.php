<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class OBP1_Certificate_Plugin {
	private static $instance = null;
	private $table_certificates;
	private $table_templates;
	private $table_events;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function __construct() {
		global $wpdb;
		$this->table_certificates = $wpdb->prefix . 'obp1_certificates';
		$this->table_templates    = $wpdb->prefix . 'obp1_certificate_templates';
		$this->table_events       = $wpdb->prefix . 'obp1_certificate_events';

		add_action( 'init', array( $this, 'register_rewrite_rule' ) );
		add_filter( 'query_vars', array( $this, 'register_query_vars' ) );
		add_shortcode( 'obp1_verify_certificate', array( $this, 'verify_shortcode' ) );
		add_shortcode( 'obp1_certificate_dashboard', array( $this, 'dashboard_shortcode' ) );
		add_action( 'template_redirect', array( $this, 'handle_verify_route' ) );
		add_action( 'woocommerce_order_status_completed', array( $this, 'generate_for_order' ) );
		add_action( 'add_meta_boxes', array( $this, 'register_product_meta_box' ) );
		add_action( 'save_post_product', array( $this, 'save_product_meta' ) );
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
	}

	public static function activate() {
		self::instance()->create_tables();
		self::instance()->register_rewrite_rule();
		flush_rewrite_rules();
	}

	public static function deactivate() {
		flush_rewrite_rules();
	}

	private function create_tables() {
		global $wpdb;
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		$charset_collate = $wpdb->get_charset_collate();
		$sql1 = "CREATE TABLE {$this->table_certificates} (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			certificate_id VARCHAR(64) NOT NULL,
			serial_number VARCHAR(64) NOT NULL,
			certificate_type VARCHAR(64) NOT NULL,
			recipient_name VARCHAR(255) NOT NULL,
			recipient_email VARCHAR(255) DEFAULT '',
			user_id BIGINT UNSIGNED DEFAULT 0,
			order_id BIGINT UNSIGNED DEFAULT 0,
			product_id BIGINT UNSIGNED DEFAULT 0,
			issuer_name VARCHAR(255) NOT NULL,
			issuer_entity_type VARCHAR(100) DEFAULT '',
			title VARCHAR(255) DEFAULT '',
			description LONGTEXT,
			status VARCHAR(32) NOT NULL DEFAULT 'issued',
			verification_slug VARCHAR(120) NOT NULL,
			verification_url TEXT,
			qr_code_url TEXT,
			pdf_url TEXT,
			data_hash VARCHAR(128) NOT NULL,
			odin_id VARCHAR(128) DEFAULT '',
			issued_at DATETIME NOT NULL,
			expires_at DATETIME NULL,
			revoked_at DATETIME NULL,
			revocation_reason TEXT,
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			PRIMARY KEY  (id),
			UNIQUE KEY certificate_id (certificate_id),
			UNIQUE KEY serial_number (serial_number),
			UNIQUE KEY verification_slug (verification_slug),
			KEY order_product_user (order_id, product_id, user_id),
			KEY recipient_email (recipient_email)
		) $charset_collate;";
		$sql2 = "CREATE TABLE {$this->table_templates} (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			template_key VARCHAR(100) NOT NULL,
			template_name VARCHAR(255) NOT NULL,
			certificate_type VARCHAR(64) NOT NULL,
			issuer_name VARCHAR(255) DEFAULT '',
			issuer_entity_type VARCHAR(100) DEFAULT '',
			html_template LONGTEXT NOT NULL,
			css_template LONGTEXT,
			logo_url TEXT,
			seal_url TEXT,
			signature_name VARCHAR(255) DEFAULT '',
			signature_title VARCHAR(255) DEFAULT '',
			footer_text LONGTEXT,
			is_active TINYINT(1) DEFAULT 1,
			created_at DATETIME NOT NULL,
			updated_at DATETIME NOT NULL,
			PRIMARY KEY (id),
			UNIQUE KEY template_key (template_key)
		) $charset_collate;";
		$sql3 = "CREATE TABLE {$this->table_events} (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			certificate_id BIGINT UNSIGNED NOT NULL,
			event_type VARCHAR(64) NOT NULL,
			event_data LONGTEXT,
			actor_id BIGINT UNSIGNED DEFAULT 0,
			created_at DATETIME NOT NULL,
			PRIMARY KEY (id),
			KEY certificate_id (certificate_id),
			KEY event_type (event_type)
		) $charset_collate;";
		dbDelta( $sql1 ); dbDelta( $sql2 ); dbDelta( $sql3 );
	}

	public function generate_for_order( $order_id ) {
		if ( ! class_exists( 'WC_Order' ) ) { return; }
		$order = wc_get_order( $order_id );
		if ( ! $order ) { return; }
		foreach ( $order->get_items() as $item ) {
			$product_id = (int) $item->get_product_id();
			$type = get_post_meta( $product_id, '_obp1_certificate_type', true );
			if ( empty( $type ) ) { continue; }
			$this->maybe_issue_certificate( $order, $product_id, $type );
		}
	}

	private function maybe_issue_certificate( $order, $product_id, $certificate_type ) {
		global $wpdb;
		$user_id = (int) $order->get_user_id();
		$exists = $wpdb->get_var( $wpdb->prepare( "SELECT id FROM {$this->table_certificates} WHERE order_id=%d AND product_id=%d AND user_id=%d", $order->get_id(), $product_id, $user_id ) );
		if ( $exists ) { return; }
		$recipient_name = sanitize_text_field( $order->get_formatted_billing_full_name() );
		$recipient_email = sanitize_email( $order->get_billing_email() );
		$certificate_id = wp_generate_uuid4();
		$serial = 'OBP1-' . gmdate( 'Ymd' ) . '-' . strtoupper( wp_generate_password( 6, false, false ) );
		$slug = sanitize_title( $serial . '-' . wp_generate_password( 5, false, false ) );
		$verification_url = home_url( '/verify-certificate/' . $slug );
		$data_hash = hash( 'sha256', $certificate_id . '|' . $serial . '|' . $recipient_email );
		$issued_at = current_time( 'mysql', 1 );
		$now = current_time( 'mysql', 1 );
		$wpdb->insert( $this->table_certificates, array(
			'certificate_id' => $certificate_id, 'serial_number' => $serial, 'certificate_type' => sanitize_text_field( $certificate_type ),
			'recipient_name' => $recipient_name, 'recipient_email' => $recipient_email, 'user_id' => $user_id,
			'order_id' => $order->get_id(), 'product_id' => $product_id, 'issuer_name' => get_bloginfo( 'name' ),
			'issuer_entity_type' => 'organization', 'title' => sanitize_text_field( get_the_title( $product_id ) ), 'description' => '',
			'status' => 'issued', 'verification_slug' => $slug, 'verification_url' => esc_url_raw( $verification_url ),
			'data_hash' => $data_hash, 'issued_at' => $issued_at, 'created_at' => $now, 'updated_at' => $now,
		) );
		$cert_db_id = (int) $wpdb->insert_id;
		$this->generate_qr( $cert_db_id );
		$this->generate_pdf( $cert_db_id );
		$this->log_event( $cert_db_id, 'created', array( 'order_id' => $order->get_id() ) );
		$order->add_order_note( 'OBP-1 certificate generated: ' . $serial );
	}

	private function generate_qr( $cert_id ) {
		global $wpdb;
		$cert = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$this->table_certificates} WHERE id=%d", $cert_id ), ARRAY_A );
		if ( ! $cert ) { return; }
		$upload = wp_upload_dir();
		$dir = trailingslashit( $upload['basedir'] ) . 'obp1-certificates/qr';
		wp_mkdir_p( $dir );
		$file = $dir . '/qr-' . $cert['certificate_id'] . '.png';
		$qr_api = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' . rawurlencode( $cert['verification_url'] );
		$content = wp_remote_retrieve_body( wp_remote_get( esc_url_raw( $qr_api ) ) );
		if ( $content ) {
			file_put_contents( $file, $content );
			$url = trailingslashit( $upload['baseurl'] ) . 'obp1-certificates/qr/qr-' . $cert['certificate_id'] . '.png';
			$wpdb->update( $this->table_certificates, array( 'qr_code_url' => esc_url_raw( $url ) ), array( 'id' => $cert_id ) );
			$this->log_event( $cert_id, 'qr_generated' );
		}
	}

	private function generate_pdf( $cert_id ) {
		global $wpdb;
		$cert = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$this->table_certificates} WHERE id=%d", $cert_id ), ARRAY_A );
		if ( ! $cert ) { return; }
		$upload = wp_upload_dir();
		$dir = trailingslashit( $upload['basedir'] ) . 'obp1-certificates';
		wp_mkdir_p( $dir );
		$file = $dir . '/certificate-' . $cert['certificate_id'] . '.html';
		$html = '<html><body><h1>Certificate</h1><p>Serial: ' . esc_html( $cert['serial_number'] ) . '</p><p>Recipient: ' . esc_html( $cert['recipient_name'] ) . '</p><p>Issuer: ' . esc_html( $cert['issuer_name'] ) . '</p><p>Issued: ' . esc_html( $cert['issued_at'] ) . '</p><p>Verify: ' . esc_html( $cert['verification_url'] ) . '</p><p>Hash: ' . esc_html( substr( $cert['data_hash'], 0, 16 ) ) . '</p><p>This certificate is a record of issuance, access, completion, ownership, contribution, or participation only. It does not represent equity, public securities, governmental status, citizenship, land title, or state-conferred authority unless expressly stated in a separate signed legal instrument.</p></body></html>';
		file_put_contents( $file, $html );
		$pdf_url = trailingslashit( $upload['baseurl'] ) . 'obp1-certificates/certificate-' . $cert['certificate_id'] . '.html';
		$wpdb->update( $this->table_certificates, array( 'pdf_url' => esc_url_raw( $pdf_url ) ), array( 'id' => $cert_id ) );
		$this->log_event( $cert_id, 'pdf_generated' );
	}

	private function log_event( $cert_id, $type, $data = array() ) {
		global $wpdb;
		$wpdb->insert( $this->table_events, array(
			'certificate_id' => $cert_id,
			'event_type' => sanitize_key( $type ),
			'event_data' => wp_json_encode( $data ),
			'actor_id' => get_current_user_id(),
			'created_at' => current_time( 'mysql', 1 ),
		) );
	}

	public function register_product_meta_box() { add_meta_box( 'obp1_cert_meta', 'OBP-1 Certificate', array( $this, 'render_product_meta_box' ), 'product', 'side' ); }
	public function render_product_meta_box( $post ) {
		wp_nonce_field( 'obp1_save_product_meta', 'obp1_nonce' );
		$type = get_post_meta( $post->ID, '_obp1_certificate_type', true );
		echo '<p><label for="obp1_certificate_type">Certificate Type</label><input type="text" name="obp1_certificate_type" value="' . esc_attr( $type ) . '" class="widefat" /></p>';
	}
	public function save_product_meta( $post_id ) {
		if ( ! isset( $_POST['obp1_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['obp1_nonce'] ) ), 'obp1_save_product_meta' ) ) { return; }
		if ( ! current_user_can( 'edit_post', $post_id ) ) { return; }
		if ( isset( $_POST['obp1_certificate_type'] ) ) { update_post_meta( $post_id, '_obp1_certificate_type', sanitize_text_field( wp_unslash( $_POST['obp1_certificate_type'] ) ) ); }
	}

	public function register_rewrite_rule() { add_rewrite_rule( '^verify-certificate/([^/]*)/?', 'index.php?obp1_verify_slug=$matches[1]', 'top' ); }
	public function register_query_vars( $vars ) { $vars[] = 'obp1_verify_slug'; return $vars; }
	public function handle_verify_route() {
		$slug = get_query_var( 'obp1_verify_slug' );
		if ( empty( $slug ) ) { return; }
		status_header( 200 );
		echo do_shortcode( '[obp1_verify_certificate slug="' . sanitize_title( $slug ) . '"]' );
		exit;
	}
	public function verify_shortcode( $atts ) {
		global $wpdb;
		$atts = shortcode_atts( array( 'slug' => get_query_var( 'obp1_verify_slug' ) ), $atts );
		$cert = $wpdb->get_row( $wpdb->prepare( "SELECT status, certificate_type, recipient_name, issuer_name, serial_number, issued_at, data_hash, odin_id, id FROM {$this->table_certificates} WHERE verification_slug=%s", sanitize_title( $atts['slug'] ) ), ARRAY_A );
		if ( ! $cert ) { return '<p>Certificate not found.</p>'; }
		$this->log_event( (int) $cert['id'], 'verified' );
		return '<h2>Certificate Verification</h2><ul><li>Status: ' . esc_html( $cert['status'] ) . '</li><li>Type: ' . esc_html( $cert['certificate_type'] ) . '</li><li>Recipient: ' . esc_html( $cert['recipient_name'] ) . '</li><li>Issuer: ' . esc_html( $cert['issuer_name'] ) . '</li><li>Serial: ' . esc_html( $cert['serial_number'] ) . '</li><li>Issue Date: ' . esc_html( $cert['issued_at'] ) . '</li><li>Hash: ' . esc_html( substr( $cert['data_hash'], 0, 12 ) ) . '...</li><li>ODIN ID: ' . esc_html( $cert['odin_id'] ) . '</li></ul>';
	}
	public function dashboard_shortcode() {
		if ( ! is_user_logged_in() ) { return '<p>Please log in.</p>'; }
		global $wpdb; $uid = get_current_user_id();
		$rows = $wpdb->get_results( $wpdb->prepare( "SELECT id, serial_number, certificate_type, status, pdf_url FROM {$this->table_certificates} WHERE user_id=%d ORDER BY issued_at DESC", $uid ), ARRAY_A );
		$out = '<table><tr><th>Serial</th><th>Type</th><th>Status</th><th>Download</th></tr>';
		foreach ( $rows as $row ) {
			$out .= '<tr><td>' . esc_html( $row['serial_number'] ) . '</td><td>' . esc_html( $row['certificate_type'] ) . '</td><td>' . esc_html( $row['status'] ) . '</td><td><a href="' . esc_url( $row['pdf_url'] ) . '">Download</a></td></tr>';
		}
		return $out . '</table>';
	}

	public function admin_menu() {
		add_menu_page( 'OBP-1 Certificates', 'OBP-1 Certificates', 'manage_options', 'obp1-certificates', array( $this, 'render_admin_certificates' ) );
		add_submenu_page( 'obp1-certificates', 'Templates', 'Templates', 'manage_options', 'obp1-templates', array( $this, 'render_admin_templates' ) );
		add_submenu_page( 'obp1-certificates', 'Settings', 'Settings', 'manage_options', 'obp1-settings', array( $this, 'render_admin_settings' ) );
	}
	public function render_admin_certificates() { echo '<div class="wrap"><h1>Certificates</h1></div>'; }
	public function render_admin_templates() { echo '<div class="wrap"><h1>Templates</h1></div>'; }
	public function render_admin_settings() { echo '<div class="wrap"><h1>Settings</h1></div>'; }

	public function register_rest_routes() {
		register_rest_route( 'obp1/v1', '/verify/(?P<serial>[a-zA-Z0-9\-]+)', array( 'methods' => 'GET', 'callback' => array( $this, 'rest_verify' ), 'permission_callback' => '__return_true' ) );
		register_rest_route( 'obp1/v1', '/certificates', array(
			array( 'methods' => 'GET', 'callback' => array( $this, 'rest_certificates' ), 'permission_callback' => array( $this, 'admin_permission' ) ),
			array( 'methods' => 'POST', 'callback' => array( $this, 'rest_create_certificate' ), 'permission_callback' => array( $this, 'admin_permission' ) ),
		) );
		register_rest_route( 'obp1/v1', '/certificates/(?P<id>\d+)', array( 'methods' => 'GET', 'callback' => array( $this, 'rest_get_certificate' ), 'permission_callback' => array( $this, 'admin_permission' ) ) );
		register_rest_route( 'obp1/v1', '/certificates/(?P<id>\d+)/(revoke|reissue)', array( 'methods' => 'POST', 'callback' => array( $this, 'rest_status_action' ), 'permission_callback' => array( $this, 'admin_permission' ) ) );
		register_rest_route( 'obp1/v1', '/templates', array(
			array( 'methods' => 'GET', 'callback' => array( $this, 'rest_templates' ), 'permission_callback' => array( $this, 'admin_permission' ) ),
			array( 'methods' => 'POST', 'callback' => array( $this, 'rest_create_template' ), 'permission_callback' => array( $this, 'admin_permission' ) ),
		) );
	}
	public function admin_permission() { return current_user_can( 'manage_options' ); }
	public function rest_verify( $request ) { global $wpdb; return $wpdb->get_row( $wpdb->prepare( "SELECT status, certificate_type, recipient_name, issuer_name, serial_number, issued_at, data_hash, odin_id FROM {$this->table_certificates} WHERE serial_number=%s", sanitize_text_field( $request['serial'] ) ), ARRAY_A ); }
	public function rest_certificates() { global $wpdb; return $wpdb->get_results( "SELECT * FROM {$this->table_certificates} ORDER BY issued_at DESC LIMIT 200", ARRAY_A ); }
	public function rest_get_certificate( $request ) { global $wpdb; return $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$this->table_certificates} WHERE id=%d", (int) $request['id'] ), ARRAY_A ); }
	public function rest_create_certificate( $request ) { return new WP_REST_Response( array( 'message' => 'Use WooCommerce completion or custom workflow.' ), 201 ); }
	public function rest_status_action( $request ) { global $wpdb; $id = (int) $request['id']; $route = $request->get_route(); $action = false !== strpos( $route, 'revoke' ) ? 'revoked' : 'reissued'; $wpdb->update( $this->table_certificates, array( 'status' => $action, 'revoked_at' => 'revoked' === $action ? current_time( 'mysql', 1 ) : null ), array( 'id' => $id ) ); $this->log_event( $id, 'revoked' === $action ? 'revoked' : 'reissued' ); return array( 'status' => $action ); }
	public function rest_templates() { global $wpdb; return $wpdb->get_results( "SELECT * FROM {$this->table_templates} ORDER BY template_name ASC", ARRAY_A ); }
	public function rest_create_template( $request ) { global $wpdb; $now = current_time( 'mysql', 1 ); $wpdb->insert( $this->table_templates, array( 'template_key' => sanitize_key( $request['template_key'] ), 'template_name' => sanitize_text_field( $request['template_name'] ), 'certificate_type' => sanitize_text_field( $request['certificate_type'] ), 'issuer_name' => sanitize_text_field( $request['issuer_name'] ), 'issuer_entity_type' => sanitize_text_field( $request['issuer_entity_type'] ), 'html_template' => wp_kses_post( $request['html_template'] ), 'css_template' => wp_strip_all_tags( $request['css_template'] ), 'logo_url' => esc_url_raw( $request['logo_url'] ), 'seal_url' => esc_url_raw( $request['seal_url'] ), 'signature_name' => sanitize_text_field( $request['signature_name'] ), 'signature_title' => sanitize_text_field( $request['signature_title'] ), 'footer_text' => sanitize_textarea_field( $request['footer_text'] ), 'is_active' => ! empty( $request['is_active'] ) ? 1 : 0, 'created_at' => $now, 'updated_at' => $now ) ); return array( 'id' => (int) $wpdb->insert_id ); }
}
