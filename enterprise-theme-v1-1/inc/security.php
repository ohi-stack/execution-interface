<?php
/**
 * Security hardening.
 *
 * @package enterprise-theme-v1-1
 */

declare(strict_types=1);

function og_disable_file_editor(): void {
	if ( ! defined( 'DISALLOW_FILE_EDIT' ) ) {
		define( 'DISALLOW_FILE_EDIT', true );
	}
}
add_action( 'after_setup_theme', 'og_disable_file_editor' );

function og_sanitize_email_strict( string $email ): string {
	$sanitized = sanitize_email( $email );
	return is_email( $sanitized ) ? $sanitized : '';
}
