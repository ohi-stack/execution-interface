<?php
/**
 * Taxonomy registrations.
 *
 * @package enterprise-theme-v1-1
 */

declare(strict_types=1);

function og_register_taxonomies(): void {
	register_taxonomy(
		'capability',
		array( 'service', 'project' ),
		array(
			'label'        => __( 'Capabilities', 'enterprise-theme-v1-1' ),
			'public'       => true,
			'show_in_rest' => true,
			'hierarchical' => true,
		)
	);

	register_taxonomy(
		'industry',
		array( 'project' ),
		array(
			'label'        => __( 'Industries', 'enterprise-theme-v1-1' ),
			'public'       => true,
			'show_in_rest' => true,
			'hierarchical' => true,
		)
	);

	register_taxonomy(
		'service_type',
		array( 'service' ),
		array(
			'label'        => __( 'Service Types', 'enterprise-theme-v1-1' ),
			'public'       => true,
			'show_in_rest' => true,
			'hierarchical' => true,
		)
	);
}
add_action( 'init', 'og_register_taxonomies' );
