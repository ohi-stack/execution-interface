<?php
/**
 * Leads CPT.
 *
 * @package enterprise-theme-v1-1
 */

declare(strict_types=1);

function og_register_cpt_leads(): void {
	register_post_type(
		'lead',
		array(
			'labels'          => array(
				'name'          => __( 'Leads', 'enterprise-theme-v1-1' ),
				'singular_name' => __( 'Lead', 'enterprise-theme-v1-1' ),
			),
			'public'          => false,
			'publicly_queryable' => false,
			'exclude_from_search' => true,
			'show_ui'         => true,
			'show_in_menu'    => true,
			'show_in_rest'    => false,
			'has_archive'     => false,
			'menu_icon'       => 'dashicons-id',
			'supports'        => array( 'title', 'editor' ),
			'capability_type' => 'post',
		)
	);
}
add_action( 'init', 'og_register_cpt_leads' );
