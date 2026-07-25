<?php
defined( 'ABSPATH' ) || exit;

class OCH_Repository {
	private $db;
	public function __construct( $db = null ) { global $wpdb; $this->db = $db ?: $wpdb; }
	private function table( $name ) { return $this->db->prefix . 'och_' . $name; }

	public function authorization_context( $type, $id ) {
		$allowed = array( 'clients', 'bookings', 'visits', 'incidents', 'documents', 'payments', 'training_assignments' );
		if ( ! in_array( $type, $allowed, true ) ) { return null; }
		if ( 'clients' === $type ) {
			$sql = "SELECT id AS client_id, user_id AS owner_user_id FROM {$this->table('clients')} WHERE id=%d";
		} else {
			$sql = "SELECT client_id, owner_user_id FROM {$this->table($type)} WHERE id=%d";
		}
		$row = $this->db->get_row( $this->db->prepare( $sql, absint( $id ) ), ARRAY_A );
		return $row ? array_map( 'intval', $row ) : null;
	}
	public function family_is_authorized( $user_id, $client_id ) {
		return (bool) $this->db->get_var( $this->db->prepare( "SELECT id FROM {$this->table('family_authorizations')} WHERE user_id=%d AND client_id=%d AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at>UTC_TIMESTAMP())", $user_id, $client_id ) );
	}
	public function provider_is_assigned( $user_id, $client_id ) {
		return (bool) $this->db->get_var( $this->db->prepare( "SELECT b.id FROM {$this->table('bookings')} b JOIN {$this->table('provider_profiles')} p ON p.id=b.provider_id WHERE p.user_id=%d AND b.client_id=%d AND b.status IN ('assigned','confirmed','in_progress')", $user_id, $client_id ) );
	}
	public function staff_has_scope( $user_id, $client_id ) {
		return (bool) $this->db->get_var( $this->db->prepare( "SELECT id FROM {$this->table('clients')} WHERE id=%d AND (manager_user_id=%d OR coordinator_user_id=%d)", $client_id, $user_id, $user_id ) );
	}
}
