<?php
/**
 * Hero block.
 *
 * @package enterprise-theme-v1-1
 */

$state = $args['state'] ?? og_build_theme_state();
?>
<section class="og-card">
	<h1><?php echo esc_html( get_bloginfo( 'name' ) ); ?></h1>
	<p><?php echo esc_html( ucfirst( $state['mode'] ) ); ?></p>
</section>
