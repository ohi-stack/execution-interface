<?php
defined( 'ABSPATH' ) || exit;

final class OCH_Settings {
	const OPTION = 'och_production_settings';
	public static function defaults() { return array( 'notification_recipient' => 'onecompanionhomemakers@gmail.com', 'google_webhook_url' => '', 'google_calendar_id' => '', 'google_credentials' => '', 'audit_retention_days' => 2555, 'document_retention_days' => 2555, 'upload_max_mb' => 10, 'upload_types' => 'pdf,jpg,jpeg,png,doc,docx', 'debug_logging' => false ); }
	public static function get( $key, $default = null ) { $settings = wp_parse_args( get_option( self::OPTION, array() ), self::defaults() ); return array_key_exists( $key, $settings ) ? $settings[ $key ] : $default; }
	public static function sanitize( $input ) {
		$old = wp_parse_args( get_option( self::OPTION, array() ), self::defaults() ); $out = self::defaults();
		$out['notification_recipient'] = sanitize_email( $input['notification_recipient'] ?? $old['notification_recipient'] );
		$out['google_webhook_url'] = esc_url_raw( $input['google_webhook_url'] ?? $old['google_webhook_url'] );
		$out['google_calendar_id'] = sanitize_text_field( $input['google_calendar_id'] ?? '' );
		// Empty secret fields preserve the stored value; secrets are never rendered back to HTML.
		$out['google_credentials'] = empty( $input['google_credentials'] ) ? $old['google_credentials'] : sanitize_textarea_field( $input['google_credentials'] );
		foreach ( array( 'audit_retention_days', 'document_retention_days', 'upload_max_mb' ) as $key ) { $out[ $key ] = max( 1, absint( $input[ $key] ?? $old[$key] ) ); }
		$out['upload_types'] = implode( ',', array_filter( array_map( static function ( $type ) { return sanitize_key( $type ); }, explode( ',', $input['upload_types'] ?? $old['upload_types'] ) ) ) );
		$out['debug_logging'] = ! empty( $input['debug_logging'] );
		OCH_Audit::log( 'settings_changed', 'settings', null, array( 'changed_fields' => implode( ',', array_keys( array_diff_assoc( $out, $old ) ) ) ) );
		return $out;
	}
	public static function public_status() { return array( 'plugin_version' => OCH_VERSION, 'schema_version' => (int) get_option( OCH_Migrations::OPTION, 0 ), 'schema_target' => OCH_SCHEMA_VERSION, 'environment' => wp_get_environment_type(), 'debug_logging' => (bool) self::get( 'debug_logging' ) ); }
}
