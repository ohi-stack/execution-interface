<?php
defined( 'ABSPATH' ) || exit;

final class OCH_Audit {
	const EVENTS = array( 'authentication', 'record_created', 'record_updated', 'record_deleted', 'assignment_changed', 'care_plan_approved', 'visit_approved', 'visit_amended', 'incident_status_changed', 'document_accessed', 'export_created', 'settings_changed', 'api_key_changed' );
	private static $blocked = array( 'password', 'token', 'secret', 'api_key', 'webhook_url', 'body', 'notes', 'details', 'content' );
	public static function log( $event, $object_type = null, $object_id = null, $metadata = array() ) {
		global $wpdb;
		if ( ! in_array( $event, self::EVENTS, true ) ) { return false; }
		$safe = array();
		foreach ( (array) $metadata as $key => $value ) {
			if ( ! in_array( strtolower( (string) $key ), self::$blocked, true ) && ( is_scalar( $value ) || null === $value ) ) { $safe[ sanitize_key( $key ) ] = sanitize_text_field( (string) $value ); }
		}
		$ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		return $wpdb->insert( $wpdb->prefix . 'och_audit_events', array( 'actor_user_id' => get_current_user_id() ?: null, 'event_type' => $event, 'object_type' => $object_type ? sanitize_key( $object_type ) : null, 'object_id' => $object_id ? absint( $object_id ) : null, 'ip_hash' => $ip ? hash_hmac( 'sha256', $ip, wp_salt( 'auth' ) ) : null, 'metadata' => wp_json_encode( $safe ), 'created_at' => current_time( 'mysql', true ) ) );
	}
}
