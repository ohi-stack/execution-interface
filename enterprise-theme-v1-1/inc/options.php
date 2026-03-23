<?php
/**
 * Config resolution and option access.
 *
 * @package enterprise-theme-v1-1
 */

declare(strict_types=1);

function og_validate_option( string $key, $value ) {
	$enum_map = array(
		'theme_mode' => array( 'services', 'platform', 'commerce' ),
		'layout'     => array( 'default', 'full', 'dashboard' ),
	);

	if ( isset( $enum_map[ $key ] ) && ! in_array( $value, $enum_map[ $key ], true ) ) {
		return null;
	}

	switch ( $key ) {
		case 'primary_color':
		case 'accent_color':
			$color = sanitize_hex_color( (string) $value );
			return $color ?: null;
		case 'heading_font':
		case 'body_font':
			return sanitize_text_field( (string) $value );
		case 'brand_radius':
			return preg_match( '/^\d+(px|rem|em|%)$/', (string) $value ) ? (string) $value : null;
		case 'feature_dashboard':
		case 'feature_hero':
			return rest_sanitize_boolean( $value );
		case 'projects_per_page':
		case 'services_per_page':
			return max( 1, absint( $value ) );
		case 'organization_url':
			return esc_url_raw( (string) $value );
		case 'organization_logo':
			return absint( $value );
		default:
			return sanitize_text_field( (string) $value );
	}
}

function og_get( string $key ) {
	$post_id  = get_queried_object_id();
	$defaults = og_default_config();
	$value    = null;

	if ( $post_id ) {
		$meta_key = '_og_' . $key;
		$meta     = get_post_meta( $post_id, $meta_key, true );
		if ( '' !== $meta && null !== $meta ) {
			$value = $meta;
		}
	}

	if ( null === $value ) {
		$theme_mod = get_theme_mod( $key, null );
		if ( null !== $theme_mod ) {
			$value = $theme_mod;
		}
	}

	if ( null === $value && array_key_exists( $key, $defaults ) ) {
		$value = $defaults[ $key ];
	}

	$validated = og_validate_option( $key, $value );
	if ( null === $validated && array_key_exists( $key, $defaults ) ) {
		$validated = og_validate_option( $key, $defaults[ $key ] );
	}

	return $validated;
}
