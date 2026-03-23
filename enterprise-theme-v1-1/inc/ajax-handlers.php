<?php
/**
 * AJAX handlers.
 *
 * @package enterprise-theme-v1-1
 */

declare(strict_types=1);

function og_handle_lead_submission(): void {
	check_ajax_referer( 'og_submit_lead', 'nonce' );

	$fields = array(
		'name'         => sanitize_text_field( wp_unslash( $_POST['name'] ?? '' ) ),
		'email'        => og_sanitize_email_strict( (string) wp_unslash( $_POST['email'] ?? '' ) ),
		'company'      => sanitize_text_field( wp_unslash( $_POST['company'] ?? '' ) ),
		'budget'       => sanitize_text_field( wp_unslash( $_POST['budget'] ?? '' ) ),
		'timeline'     => sanitize_text_field( wp_unslash( $_POST['timeline'] ?? '' ) ),
		'project_type' => sanitize_text_field( wp_unslash( $_POST['project_type'] ?? '' ) ),
		'message'      => sanitize_textarea_field( wp_unslash( $_POST['message'] ?? '' ) ),
	);

	if ( empty( $fields['name'] ) || empty( $fields['email'] ) ) {
		wp_send_json_error( array( 'message' => __( 'Name and email are required.', 'enterprise-theme-v1-1' ) ), 422 );
	}

	$lead_id = wp_insert_post(
		array(
			'post_type'    => 'lead',
			'post_status'  => 'private',
			'post_title'   => sprintf( 'Lead: %s - %s', $fields['name'], gmdate( 'Y-m-d H:i:s' ) ),
			'post_content' => wp_json_encode( $fields, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ),
		),
		true
	);

	if ( is_wp_error( $lead_id ) ) {
		wp_send_json_error( array( 'message' => __( 'Unable to save lead.', 'enterprise-theme-v1-1' ) ), 500 );
	}

	foreach ( $fields as $key => $value ) {
		update_post_meta( $lead_id, '_og_lead_' . $key, $value );
	}

	wp_send_json_success( array( 'message' => __( 'Lead submitted successfully.', 'enterprise-theme-v1-1' ) ) );
}
add_action( 'wp_ajax_og_submit_lead', 'og_handle_lead_submission' );
add_action( 'wp_ajax_nopriv_og_submit_lead', 'og_handle_lead_submission' );
