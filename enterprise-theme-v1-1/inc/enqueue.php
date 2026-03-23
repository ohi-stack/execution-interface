<?php
/**
 * Asset loading.
 *
 * @package enterprise-theme-v1-1
 */

declare(strict_types=1);

function og_enqueue_assets(): void {
	$theme = wp_get_theme();

	wp_enqueue_style(
		'og-theme-style',
		get_stylesheet_uri(),
		array(),
		$theme->get( 'Version' )
	);

	wp_enqueue_style(
		'og-theme-app',
		get_template_directory_uri() . '/assets/css/app.css',
		array( 'og-theme-style' ),
		$theme->get( 'Version' )
	);

	wp_enqueue_script(
		'og-theme-app',
		get_template_directory_uri() . '/assets/js/app.js',
		array(),
		$theme->get( 'Version' ),
		array( 'strategy' => 'defer', 'in_footer' => true )
	);

	wp_localize_script(
		'og-theme-app',
		'ogLeadForm',
		array(
			'ajaxUrl' => admin_url( 'admin-ajax.php' ),
			'nonce'   => wp_create_nonce( 'og_submit_lead' ),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'og_enqueue_assets' );
