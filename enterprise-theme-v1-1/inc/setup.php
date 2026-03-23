<?php
/**
 * Theme setup.
 *
 * @package enterprise-theme-v1-1
 */

declare(strict_types=1);

function og_theme_setup(): void {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'woocommerce' );

	register_nav_menus(
		array(
			'primary' => __( 'Primary Menu', 'enterprise-theme-v1-1' ),
			'footer'  => __( 'Footer Menu', 'enterprise-theme-v1-1' ),
		)
	);
}
add_action( 'after_setup_theme', 'og_theme_setup' );
