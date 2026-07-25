<?php
defined( 'ABSPATH' ) || exit;

final class OCH_Plugin {
	private static $authorization;
	public static function activate() { OCH_Capabilities::install(); OCH_Migrations::run(); }
	public static function boot() {
		OCH_Migrations::run(); self::$authorization = new OCH_Authorization( new OCH_Repository() );
		add_action( 'admin_menu', array( __CLASS__, 'admin_menu' ) );
		add_action( 'admin_init', array( __CLASS__, 'settings' ) );
		add_action( 'rest_api_init', array( __CLASS__, 'rest' ) );
		add_action( 'wp_login', function ( $login, $user ) { OCH_Audit::log( 'authentication', 'user', $user->ID, array( 'result' => 'success' ) ); }, 10, 2 );
	}
	public static function authorization() { return self::$authorization; }
	public static function admin_menu() { add_options_page( 'One Companion Status', 'One Companion', 'och_manage_platform_settings', 'och-status', array( __CLASS__, 'status_page' ) ); }
	public static function settings() { register_setting( 'och_settings', OCH_Settings::OPTION, array( 'type' => 'array', 'sanitize_callback' => array( 'OCH_Settings', 'sanitize' ), 'show_in_rest' => false ) ); }
	public static function status_page() {
		if ( ! current_user_can( 'och_manage_platform_settings' ) ) { wp_die( esc_html__( 'Unauthorized.', 'one-companion' ), '', array( 'response' => 403 ) ); }
		$status = OCH_Settings::public_status(); $error = get_option( 'och_last_migration_error' );
		echo '<div class="wrap"><h1>One Companion production foundation</h1><table class="widefat striped"><tbody>';
		foreach ( $status as $key => $value ) { echo '<tr><th>' . esc_html( ucwords( str_replace( '_', ' ', $key ) ) ) . '</th><td>' . esc_html( is_bool( $value ) ? ( $value ? 'Enabled' : 'Disabled' ) : $value ) . '</td></tr>'; }
		echo '</tbody></table><p>Operational status: foundation only. A schema or capability does not make a downstream workflow operational.</p>';
		if ( $error ) { echo '<div class="notice notice-error"><p>Last migration failed at version ' . esc_html( $error['version'] ) . '. Review protected server logs and restore a verified backup before rollback.</p></div>'; }
		echo '</div>';
	}
	public static function rest() {
		register_rest_route( 'och/v1', '/status', array( 'methods' => 'GET', 'callback' => function () { return rest_ensure_response( OCH_Settings::public_status() ); }, 'permission_callback' => function () { return current_user_can( 'och_manage_platform_settings' ); } ) );
		register_rest_route( 'och/v1', '/documents/(?P<id>\d+)/download', array( 'methods' => 'GET', 'callback' => function ( $request ) { $allowed = self::$authorization->require_access( 'och_manage_documents', 'documents', $request['id'] ); if ( is_wp_error( $allowed ) ) { return $allowed; } OCH_Audit::log( 'document_accessed', 'document', $request['id'] ); return new WP_Error( 'och_storage_pending', 'Document storage is not configured.', array( 'status' => 501 ) ); }, 'permission_callback' => '__return_true' ) );
	}
}
