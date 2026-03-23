<?php
/**
 * Performance optimization.
 *
 * @package enterprise-theme-v1-1
 */

declare(strict_types=1);

remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
remove_action( 'admin_print_styles', 'print_emoji_styles' );
remove_action( 'wp_head', 'wp_generator' );

function og_cleanup_wp_block_library(): void {
	if ( ! is_admin() ) {
		wp_dequeue_style( 'wp-block-library' );
		wp_dequeue_style( 'wp-block-library-theme' );
	}
}
add_action( 'wp_enqueue_scripts', 'og_cleanup_wp_block_library', 100 );
