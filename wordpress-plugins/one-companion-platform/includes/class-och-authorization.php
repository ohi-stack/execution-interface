<?php
defined( 'ABSPATH' ) || exit;

final class OCH_Authorization {
	private $repository;
	public function __construct( OCH_Repository $repository ) { $this->repository = $repository; }

	public function can( $user_id, $capability, $resource_type = '', $resource_id = 0 ) {
		if ( ! user_can( $user_id, $capability ) ) { return false; }
		if ( user_can( $user_id, 'och_manage_platform_settings' ) ) { return true; }
		if ( ! $resource_type || ! $resource_id ) { return true; }
		$context = $this->repository->authorization_context( $resource_type, $resource_id );
		if ( ! $context ) { return false; }
		if ( (int) $context['owner_user_id'] === (int) $user_id ) { return true; }
		if ( $context['client_id'] && $this->repository->family_is_authorized( $user_id, $context['client_id'] ) ) { return true; }
		if ( $context['client_id'] && $this->repository->provider_is_assigned( $user_id, $context['client_id'] ) ) { return true; }
		return $this->repository->staff_has_scope( $user_id, $context['client_id'] );
	}

	public function require_access( $capability, $type, $id ) {
		if ( ! $this->can( get_current_user_id(), $capability, $type, $id ) ) {
			return new WP_Error( 'och_forbidden', __( 'You are not authorized to access this record.', 'one-companion' ), array( 'status' => 403 ) );
		}
		return true;
	}
}
