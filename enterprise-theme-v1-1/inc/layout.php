<?php
/**
 * State and layout helpers.
 *
 * @package enterprise-theme-v1-1
 */

declare(strict_types=1);

function og_build_theme_state(): array {
	$mode = (string) og_get( 'theme_mode' );

	return array(
		'mode'          => in_array( $mode, array( 'services', 'platform', 'commerce' ), true ) ? $mode : 'services',
		'layout'        => (string) og_get( 'layout' ),
		'brand_tokens'  => array(
			'primary'      => (string) og_get( 'primary_color' ),
			'accent'       => (string) og_get( 'accent_color' ),
			'radius'       => (string) og_get( 'brand_radius' ),
			'font_heading' => (string) og_get( 'heading_font' ),
			'font_body'    => (string) og_get( 'body_font' ),
		),
		'feature_flags' => array(
			'dashboard' => (bool) og_get( 'feature_dashboard' ),
			'hero'      => (bool) og_get( 'feature_hero' ),
		),
		'variants'      => array(
			'cta_label' => (string) og_get( 'service_cta_label' ),
		),
	);
}

function og_print_brand_tokens(): void {
	$state = og_build_theme_state();
	$css   = sprintf(
		':root{--primary:%1$s;--accent:%2$s;--radius:%3$s;--font-heading:%4$s;--font-body:%5$s;}',
		esc_attr( $state['brand_tokens']['primary'] ),
		esc_attr( $state['brand_tokens']['accent'] ),
		esc_attr( $state['brand_tokens']['radius'] ),
		esc_attr( $state['brand_tokens']['font_heading'] ),
		esc_attr( $state['brand_tokens']['font_body'] )
	);
	echo '<style id="og-brand-tokens">' . wp_strip_all_tags( $css ) . '</style>';
}
add_action( 'wp_head', 'og_print_brand_tokens', 20 );


function og_get_dashboard_metrics(): array {
	return array(
		'services' => (int) ( wp_count_posts( 'service' )->publish ?? 0 ),
		'projects' => (int) ( wp_count_posts( 'project' )->publish ?? 0 ),
	);
}
