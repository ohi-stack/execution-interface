<?php
/**
 * Projects CPT.
 *
 * @package enterprise-theme-v1-1
 */

declare(strict_types=1);

function og_register_cpt_projects(): void {
	register_post_type(
		'project',
		array(
			'labels'       => array(
				'name'          => __( 'Projects', 'enterprise-theme-v1-1' ),
				'singular_name' => __( 'Project', 'enterprise-theme-v1-1' ),
			),
			'public'       => true,
			'has_archive'  => true,
			'menu_icon'    => 'dashicons-portfolio',
			'show_in_rest' => true,
			'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
			'rewrite'      => array( 'slug' => 'projects' ),
		)
	);
}
add_action( 'init', 'og_register_cpt_projects' );
