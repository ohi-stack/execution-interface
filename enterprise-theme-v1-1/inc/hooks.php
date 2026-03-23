<?php
/**
 * Theme hooks.
 *
 * @package enterprise-theme-v1-1
 */

declare(strict_types=1);

function og_body_class( array $classes ): array {
	$state     = og_build_theme_state();
	$classes[] = 'og-mode-' . sanitize_html_class( $state['mode'] );
	$classes[] = 'og-layout-' . sanitize_html_class( $state['layout'] );
	return $classes;
}
add_filter( 'body_class', 'og_body_class' );
