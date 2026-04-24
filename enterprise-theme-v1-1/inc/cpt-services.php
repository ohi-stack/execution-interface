<?php
/**
 * Services CPT.
 *
 * @package enterprise-theme-v1-1
 */

declare(strict_types=1);

function og_register_cpt_services(): void {
	register_post_type(
		'service',
		array(
			'labels'       => array(
				'name'          => __( 'Services', 'enterprise-theme-v1-1' ),
				'singular_name' => __( 'Service', 'enterprise-theme-v1-1' ),
			),
			'public'       => true,
			'has_archive'  => true,
			'menu_icon'    => 'dashicons-hammer',
			'show_in_rest' => true,
			'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
			'rewrite'      => array( 'slug' => 'services' ),
		)
	);
}
add_action( 'init', 'og_register_cpt_services' );
