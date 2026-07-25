<?php
defined( 'ABSPATH' ) || exit;

final class OCH_Capabilities {
	const ALL = array(
		'och_view_assigned_clients', 'och_view_client_profile', 'och_manage_client_records',
		'och_view_care_plan', 'och_manage_care_plans', 'och_manage_availability',
		'och_manage_bookings', 'och_assign_providers', 'och_submit_visit_notes',
		'och_review_visit_notes', 'och_clock_in', 'och_clock_out', 'och_submit_mileage',
		'och_approve_timekeeping', 'och_submit_incidents', 'och_review_incidents',
		'och_manage_documents', 'och_manage_training', 'och_view_family_updates',
		'och_manage_payments', 'och_export_reports', 'och_manage_platform_settings',
	);

	public static function matrix() {
		$all      = self::ALL;
		$provider = array( 'och_view_assigned_clients', 'och_view_client_profile', 'och_view_care_plan', 'och_manage_availability', 'och_submit_visit_notes', 'och_clock_in', 'och_clock_out', 'och_submit_mileage', 'och_submit_incidents', 'och_manage_documents', 'och_manage_training' );
		return array(
			'och_administrator' => $all,
			'och_manager' => array_diff( $all, array( 'och_manage_platform_settings' ) ),
			'och_care_coordinator' => array( 'och_view_assigned_clients', 'och_view_client_profile', 'och_manage_client_records', 'och_view_care_plan', 'och_manage_care_plans', 'och_manage_bookings', 'och_assign_providers', 'och_review_visit_notes', 'och_approve_timekeeping', 'och_submit_incidents', 'och_review_incidents', 'och_manage_documents', 'och_manage_training', 'och_view_family_updates', 'och_export_reports' ),
			'och_client' => array( 'och_view_client_profile', 'och_view_care_plan', 'och_manage_bookings', 'och_submit_incidents', 'och_manage_documents', 'och_view_family_updates', 'och_manage_payments' ),
			'och_authorized_family' => array( 'och_view_client_profile', 'och_view_care_plan', 'och_manage_bookings', 'och_submit_incidents', 'och_manage_documents', 'och_view_family_updates', 'och_manage_payments' ),
			'och_applicant' => array( 'och_manage_documents', 'och_manage_training' ),
			'och_employee' => array( 'och_manage_availability', 'och_clock_in', 'och_clock_out', 'och_submit_mileage', 'och_submit_incidents', 'och_manage_documents', 'och_manage_training' ),
			'och_companion' => $provider,
			'och_homemaker' => $provider,
			'och_driver' => $provider,
			'och_handyman_provider' => $provider,
			'och_student' => array( 'och_manage_documents', 'och_manage_training' ),
			'och_instructor' => array( 'och_manage_documents', 'och_manage_training' ),
		);
	}

	public static function install() {
		foreach ( self::matrix() as $slug => $capabilities ) {
			$role = get_role( $slug );
			if ( ! $role ) {
				$role = add_role( $slug, ucwords( str_replace( array( 'och_', '_' ), array( '', ' ' ), $slug ) ), array( 'read' => true ) );
			}
			if ( $role ) {
				foreach ( self::ALL as $capability ) {
					$role->remove_cap( $capability );
				}
				foreach ( $capabilities as $capability ) {
					$role->add_cap( $capability );
				}
			}
		}
		$administrator = get_role( 'administrator' );
		if ( $administrator ) {
			foreach ( self::ALL as $capability ) { $administrator->add_cap( $capability ); }
		}
	}
}
