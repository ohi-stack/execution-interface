<?php
/**
 * JSON-LD schema output.
 *
 * @package enterprise-theme-v1-1
 */

declare(strict_types=1);

function og_schema_organization(): array {
	$logo_id = (int) og_get( 'organization_logo' );
	$logo    = $logo_id ? wp_get_attachment_image_url( $logo_id, 'full' ) : '';

	return array(
		'@context' => 'https://schema.org',
		'@type'    => 'Organization',
		'name'     => (string) og_get( 'organization_name' ),
		'url'      => (string) og_get( 'organization_url' ),
		'logo'     => $logo ? esc_url( $logo ) : null,
	);
}

function og_schema_service(): ?array {
	if ( ! is_singular( 'service' ) ) {
		return null;
	}

	return array(
		'@context'    => 'https://schema.org',
		'@type'       => 'Service',
		'name'        => get_the_title(),
		'description' => wp_strip_all_tags( (string) get_the_excerpt() ),
		'provider'    => array(
			'@type' => 'Organization',
			'name'  => (string) og_get( 'organization_name' ),
		),
	);
}

function og_output_schema(): void {
	$payloads = array_filter( array( og_schema_organization(), og_schema_service() ) );
	foreach ( $payloads as $payload ) {
		echo '<script type="application/ld+json">' . wp_json_encode( $payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . '</script>';
	}
}
add_action( 'wp_head', 'og_output_schema', 30 );
